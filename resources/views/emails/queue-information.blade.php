<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">

    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 6px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #2c3e50;">Queue Information</h2>

        <p style="font-size: 16px; color: #333;">Dear {{ $queueData['name'] }},</p>

        <p style="font-size: 14px; color: #333;">Here is your queue information:</p>

        <ul style="font-size: 14px; color: #333; line-height: 1.6;">
            <li>Queue Number: <strong>{{ $queueData['queueNumber'] }}</strong></li>
            <li>Student ID: {{ $queueData['student_id'] }}</li>
            <li>Purpose: {{ $queueData['purpose'] }}</li>
        </ul>

        <p style="font-size: 14px; color: #333;">Thank you for using the <strong>NextInLine Queue System</strong>.</p>

        <p style="font-size: 14px; color: #333;">
            Best regards,<br>
            <strong>DSR GROUP - NextInLine</strong>
        </p>
    </div>

</body>
</html>
