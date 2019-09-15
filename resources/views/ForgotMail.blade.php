<html>
    <head>
        <title>
            Verification Page
        </title>
        <style>
         .button {
         background-color: #DEE4E7;
         border: none;
         color: white;
         padding: 15px 35px;
         text-align: center;
         display: inline-block;
         font-size: 20px;
         margin: 4px 2px;
         border-radius: 5px;
         }
      </style>
    </head>

    <body>
        <strong>Hi {{ $user }}, </strong> <br>
        <p>You recently requested to reset your password for you Hypertube Account.</p><br>
        <p> Your new password is: </p> <br>
        <div style="text-align:center;">
            <p class="button">{{ $rand }}</p>
        </div>

    </body>
</html>