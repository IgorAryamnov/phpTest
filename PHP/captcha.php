<?php

$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz';
$length = 6;
$code = substr(str_shuffle($chars), 0, $length);

$value = crypt($code, "salt");
$expires = time() + 600;
setcookie('captcha', $value, $expires, '/', 'localhost', false, false);

$image = imagecreatefrompng(__DIR__ . '/bg.png');
$size = 36;
$color = imagecolorallocate($image, 66, 182, 66);
$font = __DIR__ . '/oswald.ttf';
$angle = rand(-10, 10);
$x = 56;
$y = 64;
imagefttext($image, $size, $angle, $x, $y, $color, $font, $code);
header('Cache-Control: no-store, must-revalidate');
header('Expires: 0');
header('Content-Type: image/png');
imagepng($image);
imagedestroy($image);