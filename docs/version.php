<?php
$API_APP_NAME = "Sandbox";
$SOURCE_VERSION = "unknown";
$LOCAL_VERSION = shell_exec("git rev-parse HEAD");

echo "<h2>WCSBS " . $API_APP_NAME . "</h2>";
echo "Source Version: " . $SOURCE_VERSION . "<br>";
echo "Local Version: " . $LOCAL_VERSION . "<br>";
?>

<?php phpinfo();