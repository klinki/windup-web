<html>
<head>
    <title>Windup 3.0</title>
    <base href="/windup-web/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- There is some issue with html-webpack-loader trying to evaluate ${} expressions
        <script src="$ {keycloak.serverUrl}/js/keycloak.js"></script>
    -->
    <script src="http://localhost:8080/auth/js/keycloak.js"></script>

    <script>
        // this is here so that AbstractUITest can tell we are loading the actual app
        window['mainApp'] = true;
    </script>

</head>

<body>
<windup-app></windup-app>
</body>

</html>
