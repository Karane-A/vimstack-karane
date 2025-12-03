<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script type="text/javascript">
        function closethisasap() { 
            document.forms["redirectpost"].submit(); 
        }
    </script>
</head>
<body onLoad="closethisasap();">
    <form name="redirectpost" method="post" action="{{ $redirectUrl }}">
        <input type="hidden" name="_token" value="{{ $token }}">
    </form>
</body>
</html>