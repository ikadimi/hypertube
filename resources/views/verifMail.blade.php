<html>
    <head>
        <title>
            Verification Page
        </title>
        <style>
         .button {
         background-color: #1c87c9;
         border: none;
         color: white;
         padding: 15px 35px;
         text-align: center;
         text-decoration: none;
         display: inline-block;
         font-size: 20px;
         margin: 4px 2px;
         cursor: pointer;
         }
      </style>
    </head>

    <body>
        <p>Hello, {{ $user }} </p> <br>
        <p> To Verify you email please click the button bellow:</p>
        <a href="http://localhost:8000/api/verifMail/{{ $rand }}" target="_blank" class="button">Verify Email Address</a>
    </body>
</html>