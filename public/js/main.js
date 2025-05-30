let lastQueueData = null;
const viewLastQueueBtn = document.getElementById('viewLastQueue');
const apiBaseUrl = document.querySelector('meta[name="api-base-url"]').content;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close-btn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data without queue number
        const formData = {
            name: document.getElementById('name').value,
            student_id: document.getElementById('student-id').value,
            purpose: document.getElementById('purpose').value,
            email: document.getElementById('email').value
        };
        
        // Show confirmation popup
        showConfirmPopup(formData);
    });

    // Add confirmation popup handlers
    document.getElementById('confirm-submit').addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Show loading popup immediately after pressing Continue
        document.getElementById('loading-popup').style.display = 'flex';
        
        const form = document.querySelector('form');
        const apiUrl = apiBaseUrl + '/queue/register';
        
        try {
            const formDataObject = {
                name: document.getElementById('name').value,
                student_id: document.getElementById('student-id').value,
                purpose: document.getElementById('purpose').value,
                email: document.getElementById('email').value
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'X-API-Key': 'klenthadechristian',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(formDataObject)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to register queue');
            }

            // Get queue number from API response
            const queueNumber = data.queue_number || data.data.queue_number;

            // After successful queue registration, send email
            const userEmail = formDataObject.email;
            
            if (!userEmail) {
                document.getElementById('loading-popup').style.display = 'none';
                alert('No email address available');
                return;
            }
            
            // Format the email body with the queue number from API
            const body = `
            Dear ${formDataObject.name},

            Here is your queue information:

            Queue Number: ${queueNumber}
            Student ID: ${formDataObject.student_id}
            Purpose: ${formDataObject.purpose}

            Thank you for using NextInLine Queue System.

            Best regards,
            DSD GROUP - NextInLine
            `.trim();

            // Send email through backend
            try {
                const emailResponse = await fetch('/api/v1/send-queue-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        name: formDataObject.name,
                        queueNumber: queueNumber,
                        studentId: formDataObject.student_id,
                        purpose: formDataObject.purpose
                    })
                });

                if (!emailResponse.ok) {
                    throw new Error('Failed to send email');
                }
            } catch (error) {
                console.error('Email sending failed:', error);
            }

            // Hide confirmation and loading popups, show success popup
            document.getElementById('confirm-popup').style.display = 'none';
            document.getElementById('loading-popup').style.display = 'none';
            document.getElementById('success-popup').style.display = 'flex';
            
            // Update popup information
            document.getElementById('popup-name').textContent = formDataObject.name;
            document.getElementById('popup-queue-number').textContent = queueNumber;
            document.getElementById('popup-student-id').textContent = formDataObject.student_id;
            document.getElementById('popup-purpose').textContent = formDataObject.purpose;
            document.getElementById('popup-email').textContent = formDataObject.email;
            
            // Store queue data and update UI
            lastQueueData = {
                ...formDataObject,
                queue_number: queueNumber
            };
            
            viewLastQueueBtn.disabled = false;
            form.reset();

            // Show success message (now as popup)
            // alert('Your queue information has been sent to your email.');

        } catch (error) {
            console.error('Error details:', error);
            document.getElementById('loading-popup').style.display = 'none';
            alert(error.message);
            document.getElementById('confirm-popup').style.display = 'none';
        }
    });

    document.getElementById('cancel-submit').addEventListener('click', function() {
        document.getElementById('confirm-popup').style.display = 'none';
    });
    
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });
    
    document.getElementById('savePDF').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get the data
        const name = document.getElementById('popup-name').textContent;
        const studentId = document.getElementById('popup-student-id').textContent;
        const purpose = document.getElementById('popup-purpose').textContent;
        const queueNumber = document.getElementById('popup-queue-number').textContent;
        const email = document.getElementById('popup-email').textContent;

        // Title
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Queue Information', 105, 30, { align: 'center' });

        // Subtitle
        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        doc.text('NextInLine Queue System', 105, 40, { align: 'center' });

        // Draw a rounded rectangle for the info card
        doc.setDrawColor(100);
        doc.setLineWidth(0.7);
        doc.roundedRect(25, 50, 160, 80, 5, 5, 'S');

        // Info labels and values
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Name:', 35, 65);
        doc.text('Student ID:', 35, 75);
        doc.text('Purpose:', 35, 85);
        doc.text('Email:', 35, 95);

        doc.setFont('helvetica', 'normal');
        doc.text(name, 80, 65);
        doc.text(studentId, 80, 75);
        doc.text(purpose, 80, 85);
        doc.text(email, 80, 95);

        // Queue Number (emphasized)
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 90, 160);
        doc.text(`Queue Number: ${queueNumber}`, 105, 115, { align: 'center' });

        // Reset color for footer
        doc.setTextColor(0, 0, 0);

        // Footer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Generated by NextInLine | ' + new Date().toLocaleString(), 105, 285, { align: 'center' });

        // Save the PDF
        doc.save(`Your Queue Data - ${name}.pdf`);
    });

    // Add input monitoring
    const inputs = [
        document.getElementById('name'),
        document.getElementById('student-id'),
        document.getElementById('purpose'),
        document.getElementById('email')
    ];

    let notificationTimeout;

    inputs.forEach(input => {
        input.addEventListener('change', checkAllInputs);
        input.addEventListener('input', checkAllInputs);
    });

    function checkAllInputs() {
        const notification = document.getElementById('notification');
        if (!notification) return; 
        
        const allFilled = inputs.every(input => {
            const value = input.value.trim();
            if (input.id === 'purpose') {
                return value !== '' && value !== 'Select your purpose';
            }
            return value !== '';
        });

        if (allFilled) {
            notification.style.display = 'block';
        }
    }

    // Function to check and update button state
    function checkAndUpdateButtonState() {
        if (!lastQueueData) {
            viewLastQueueBtn.disabled = true;
        } else {
            viewLastQueueBtn.disabled = false;
        }
    }

    // Initially disable the button
    checkAndUpdateButtonState();

    document.getElementById('close-success-popup').addEventListener('click', function() {
        document.getElementById('success-popup').style.display = 'none';
    });

    // Cancel Queue Popup Handlers
    const cancelQueueBtn = document.getElementById('cancelQueueBtn');
    const cancelPopup = document.getElementById('cancel-popup');
    const closeCancelBtn = document.getElementById('cancel-close-btn');
    const closeCancelPopupBtn = document.getElementById('close-cancel-popup');
    const cancelQueueForm = document.getElementById('cancelQueueForm');

    // Function to close cancel popup and reset form
    function closeCancelPopupAndReset() {
        cancelPopup.style.display = 'none';
        cancelQueueForm.reset();
    }

    cancelQueueBtn.addEventListener('click', function() {
        cancelPopup.style.display = 'block';
    });

    closeCancelBtn.addEventListener('click', function() {
        closeCancelPopupAndReset();
    });

    closeCancelPopupBtn.addEventListener('click', function() {
        closeCancelPopupAndReset();
    });

    // Close cancel popup after successful submission
    cancelQueueForm?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('cancel-name').value.trim();
        const queueNumber = document.getElementById('cancel-queue-number').value.trim();

        if (!name || !queueNumber) {
            alert('Please fill in both fields.');
            return;
        }

        // Show confirmation popup instead of browser confirm
        document.getElementById('cancel-confirm-popup').style.display = 'block';
    });

    // Handle confirmation popup buttons
    document.getElementById('confirm-cancel')?.addEventListener('click', async function() {
        const name = document.getElementById('cancel-name').value.trim();
        const queueNumber = document.getElementById('cancel-queue-number').value.trim();

        try {
            const response = await fetch(apiBaseUrl + '/queue/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-API-Key': 'klenthadechristian'
                },
                body: JSON.stringify({
                    name: name,
                    queue_number: queueNumber
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert("Queue canceled successfully.");
                closeCancelPopupAndReset();
                document.getElementById('cancel-confirm-popup').style.display = 'none';
            } else {
                alert(result.message || 'Failed to cancel the queue.');
            }
        } catch (error) {
            console.error('Error canceling queue:', error);
            alert("An error occurred while canceling the queue.");
        }
    });

    document.getElementById('deny-cancel')?.addEventListener('click', function() {
        document.getElementById('cancel-confirm-popup').style.display = 'none';
    });
});

function showPopupWithData(data) {
    const noDataMessage = document.getElementById('no-data-message');
    const infoContainer = document.getElementById('info-container');
    const buttonContainer = document.querySelector('.button-container');

    if (!data) {
        // Show no-data message and hide other elements
        noDataMessage.style.display = 'block';
        infoContainer.style.display = 'none';
        buttonContainer.style.display = 'none';
    } else {
        // Show data and hide no-data message
        noDataMessage.style.display = 'none';
        infoContainer.style.display = 'block';
        buttonContainer.style.display = 'flex';
        
        // Hide email button since it's automatic now
        if (document.getElementById('sendEmail')) {
            document.getElementById('sendEmail').style.display = 'none';
        }
        // Update the information using snake_case property names
        document.getElementById('popup-name').textContent = data.name;
        document.getElementById('popup-student-id').textContent = data.student_id;
        document.getElementById('popup-purpose').textContent = data.purpose;
        document.getElementById('popup-queue-number').textContent = data.queue_number;
        if (document.getElementById('popup-email')) {
            document.getElementById('popup-email').textContent = data.email;
        }
    }

    // Show the popup
    document.getElementById('popup').style.display = 'block';
}

// Update the view last queue button click handler
document.getElementById('viewLastQueue').addEventListener('click', function() {
    showPopupWithData(lastQueueData);
});


document.addEventListener('DOMContentLoaded', function() {
    const studentIdInput = document.getElementById('student-id');
    
    studentIdInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
        
        if (value.length > 4) {
            // Insert dash after first 4 digits
            value = value.slice(0, 4) + '-' + value.slice(4);
        }
        
        // Limit the total length to 10 characters (including dash)
        value = value.slice(0, 10);
        
        e.target.value = value;
    });
});

function showConfirmPopup(data) {
    // Update confirmation popup with form data
    document.getElementById('confirm-name').textContent = data.name;
    document.getElementById('confirm-student-id').textContent = data.student_id;
    document.getElementById('confirm-purpose').textContent = data.purpose;
    document.getElementById('confirm-email').textContent = data.email;
    
    // Show the confirmation popup
    document.getElementById('confirm-popup').style.display = 'block';
}

async function updateCurrentQueueNumber() {
    try {
        const response = await fetch(apiBaseUrl + '/queue/current-serving');
        const data = await response.json();
        if (response.ok && data.current_queue_number !== undefined) {
            document.querySelector('.queue-number').textContent = data.current_queue_number.toString().padStart(2, '0');
        } else {
            document.querySelector('.queue-number').textContent = '00';
        }
    } catch (e) {
        document.querySelector('.queue-number').textContent = '00';
    }
}
setInterval(updateCurrentQueueNumber, 5000);
updateCurrentQueueNumber();

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Update theme icon
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            icon.className = 'bx bx-sun';
        } else {
            icon.className = 'bx bx-moon';
        }
    }
});
