<html>
    <head>
        <title>Email Verification</title>
    </head>
    <style>
         .box {
         border: none;
         color: white;
         padding: 15px 35px;
         text-align: center;
         display: inline-block;
         font-size: 20px;
         margin: 20px auto;
         }

         .success {
            background-color: #4bb543; 
         }
         
         .failure {
            background-color: #FF0000;  
         }
         div {
            text-align: center;
         }
      </style>
    <body>
        <div>
            @if($status == 'success')
                <h3 class="box success"> <?php echo $msg; ?> </h3>
            @else
                <h3 class="box failure"> <?php echo $msg; ?> </h3>
            @endif
        </div>
    </body>
</html>