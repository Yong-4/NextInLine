<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>NextInLine</title>
  <link rel="stylesheet" href="{{ asset('css/main.css') }}">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;400;600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/popup.css') }}">
  <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
  <header>
    <h1>NextInLine</h1>
    <div class="header-buttons">
      <button class="btn-entry" id="viewLastQueue">
          <span><i class='bx bx-show'></i></span> View Information
      </button>
      <button class="btn-theme" id="themeToggle">
          <i class='bx bx-moon'></i>
      </button>
      <a class="btn-home" onclick="location.href='{{ route('index') }}'">
          <i class='bx bxs-home' style="color: var(--text-color);"></i>
      </a>
    </div>    
  </header>

  <main>
    <div class="entry-section">
      <h2>INFORMATION ENTRY</h2>
      <form method="post" action="{{ route('QRequest.insert') }}" data-api-url="{{ route('QRequest.apiStore') }}">
        @csrf
        @method('post')
        <input type="hidden" name="X-API-Key" value="klenthadechristian">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" autocomplete="off" />

        <label for="student-id">Student ID</label>
        <input type="text" name="student_id" id="student-id" autocomplete="off" />

        <label for="purpose">Queue Purpose</label>
        <select name="purpose" id="purpose" required>
            <option value="" disabled selected>Select your purpose</option>
            <option value="Request for TOR">Request for Transcript of Records (TOR)</option>
            <option value="Enrollment Concerns">Enrollment or Registration Concerns</option>
            <option value="Document Requests">Document Requests (e.g., Certificates, ID, Diploma)</option>
            <option value="Grade Concerns">Grades or Subject Concerns</option>
            <option value="Payment Inquiries">Payment or Billing Inquiries</option>
            <option value="General Inquiry">General Inquiry or Assistance</option>
        </select>

        <label for="email">Email</label>
        <input type="email" name="email" id="email" autocomplete="off" />

        <button type="submit" class="submit-btn">Get Queue Number</button>
      </form>
    </div>

    <div class="queue-display">
      <h3>CURRENT<br/>QUEUE NUMBER</h3>
    <div class="queue-number">
    </div>
  </div>
  </main>

  <div id="confirm-popup" class="popup" style="display: none;">
    <div class="popup-content">
        <h2>Confirm Your Information</h2>
        <div class="info-container">
            <p><strong>Name:</strong> <span id="confirm-name"></span></p>
            <p><strong>Student ID:</strong> <span id="confirm-student-id"></span></p>
            <p><strong>Purpose:</strong> <span id="confirm-purpose"></span></p>
            <p><strong>Email:</strong> <span id="confirm-email"></span></p>
        </div>
        <div class="button-container">
            <button id="confirm-submit" class="submit-btn">Continue</button>
            <button id="cancel-submit" class="submit-btn" style="background-color: #ff4444;">Cancel</button>
        </div>
    </div>
  </div>

  <div id="popup" class="popup">
    <div class="popup-content">
      <h2>Queue Information</h2>
      <div id="no-data-message" class="no-data-message" style="display: none;">
        <p>No queue information available</p>
      </div>
      <div id="info-container" class="info-container">
        <p><strong>Name:</strong> <span id="popup-name"></span></p>
        <p><strong>Queue Number:</strong> <span id="popup-queue-number"></span></p>
        <p><strong>Student ID:</strong> <span id="popup-student-id"></span></p>
        <p><strong>Purpose:</strong> <span id="popup-purpose"></span></p>
        <p><strong>Email:</strong> <span id="popup-email"></span></p>
      </div>
      <div class="button-container">
        <button id="savePDF" class="action-btn pdf-btn">
          <i class='bx bx-file'></i> Save as PDF
        </button>
      </div>
      <button class="close-btn">&times;</button>
    </div>
  </div>

  <div id="loading-popup" class="popup" style="display: none;">
    <div class="popup-content" style="text-align: center;">
      <div style="margin: 2rem 0;">
        <div class="loader" style="margin: 0 auto 1rem auto;"></div>
        <p style="font-size: 1.2rem; font-weight: 500;">Processing your request...</p>
      </div>
    </div>
  </div>

  <div id="success-popup" class="popup" style="display: none;">
    <div class="popup-content" style="text-align: center;">
      <div style="margin: 2rem 0;">
        <i class='bx bx-check-circle' style="font-size: 3rem; color: #38B6FF;"></i>
        <p style="font-size: 1.2rem; font-weight: 600; margin-top: 1rem;">"Your queue request was successful, and the information has been sent to your email."</p>
      </div>
      <div class="button-container">
        <button id="close-success-popup" class="submit-btn">Close</button>
      </div>
    </div>
  </div>

  <footer>
    <p>© 2025 BSIT – 3A DSD Group.</p>
  </footer>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="{{ asset('js/main.js') }}"></script>
</body>
</html>
