<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>NextInLine</title>
  
  <!-- Correct CSS link -->
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;400;600;800&display=swap" rel="stylesheet">
  
  <!-- Add script reference before closing head tag -->
  <script src="{{ asset('js/script.js') }}"></script>
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>

<body>
  <header>
    <h1>NextInLine</h1>
    <div class="header-buttons">
        <div class="datetime-display">
            <span id="current-date"></span>
            <span id="current-time"></span>
        </div>
        <button id="themeToggle" class="btn-theme">
            <i class='bx bx-moon'></i>
        </button>
    </div>
  </header>

  <main class="container">
    <section class="left">
      <h2>Join the <br> Queue</h2>
      <p>Enter your details to secure a spot in line. <br> Stay updated on your queue status.</p>
      <button onclick="location.href='{{ route('QRequest.main') }}'">Enter Details</button>
    </section>

    <section class="right">
      <!-- Corrected image path -->
      <img src="{{ asset('images/undraw_design-inspiration_2mrc.svg') }}" alt="Queue Girl" class="girl-img"/>
      
      <div class="queue-card">
        <p class="queue-label">QUEUE<br>NUMBER</p>
        <p class="queue-number">00</p>
      </div>
    </section>
  </main>

</body>
</html>
