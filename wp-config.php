<?php

/**
 * Cấu hình cơ bản cho WordPress
 *
 * Trong quá trình cài đặt, file "wp-config.php" sẽ được tạo dựa trên nội dung
 * mẫu của file này. Bạn không bắt buộc phải sử dụng giao diện web để cài đặt,
 * chỉ cần lưu file này lại với tên "wp-config.php" và điền các thông tin cần thiết.
 *
 * File này chứa các thiết lập sau:
 *
 * * Thiết lập MySQL
 * * Các khóa bí mật
 * * Tiền tố cho các bảng database
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Thiết lập MySQL - Bạn có thể lấy các thông tin này từ host/server ** //
/** Tên database MySQL */
define('DB_NAME', 'wp-boilerplate');

/** Username của database */
define('DB_USER', 'root');

/** Mật khẩu của database */
define('DB_PASSWORD', '');

/** Hostname của database */
define('DB_HOST', 'localhost');

/** Database charset sử dụng để tạo bảng database. */
define('DB_CHARSET', 'utf8');

/** Kiểu database collate. Đừng thay đổi nếu không hiểu rõ. */
define('DB_COLLATE', '');

/**#@+
 * Khóa xác thực và salt.
 *
 * Thay đổi các giá trị dưới đây thành các khóa không trùng nhau!
 * Bạn có thể tạo ra các khóa này bằng công cụ
 * {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * Bạn có thể thay đổi chúng bất cứ lúc nào để vô hiệu hóa tất cả
 * các cookie hiện có. Điều này sẽ buộc tất cả người dùng phải đăng nhập lại.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '3]-nxQDV*!wH0FX|38cs!u7yp]w#w-ODOi2c}T]&+G42W-U*E9_7S-4<m<=0DpEs');
define('SECURE_AUTH_KEY',  '0w2tFuc!Isk9D @I;%7S*yjj0]^K=!+7&SL2LMl!Fedz7j92btp|m<15S,VI|~qg');
define('LOGGED_IN_KEY',    'Bhg8vHfRa_t]iY/0c[Go}.-]h*6h!%TFcRJI2A I8||]Z~D~u-(pI0u7p|?);G.G');
define('NONCE_KEY',        'WC?|iCEBrSL]2$+fgpu0.&zf2=a_;yRs5$ND^h;3^lwsz@xB`$ ;gg-zFd%F_*)u');
define('AUTH_SALT',        'x+.mc0p4RMJlr>.z]-GL@g3DF`)MJ^|46|UHmh5r>sn+}VaTjZ{~etBK3==h6eh8');
define('SECURE_AUTH_SALT', '4x,)|Sf]2/=VXqueu.X1fB7@wf1,gg?(ILcY[81`8_xWq9*/cFF|#5x$K0pI@;hB');
define('LOGGED_IN_SALT',   'F%D^ib07uRR-uE9N|2gr!5xFCqE3zdPX:i,QvBXhm}Zv0_&5U-R9p>HI%=%k#Km#');
define('NONCE_SALT',       's uy{#kU].Yq35IdRYe /85I;/bGukge&4LXGmCIb5Gg:JvW:3d+G|[liass{2WP');

/**#@-*/

/**
 * Tiền tố cho bảng database.
 *
 * Đặt tiền tố cho bảng giúp bạn có thể cài nhiều site WordPress vào cùng một database.
 * Chỉ sử dụng số, ký tự và dấu gạch dưới!
 */
$table_prefix  = 'wp_';

/**
 * Dành cho developer: Chế độ debug.
 *
 * Thay đổi hằng số này thành true sẽ làm hiện lên các thông báo trong quá trình phát triển.
 * Chúng tôi khuyến cáo các developer sử dụng WP_DEBUG trong quá trình phát triển plugin và theme.
 *
 * Để có thông tin về các hằng số khác có thể sử dụng khi debug, hãy xem tại Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', true);
define('WP_DEBUG_DISPLAY', true);

/* Đó là tất cả thiết lập, ngưng sửa từ phần này trở xuống. Chúc bạn viết blog vui vẻ. */

/** Đường dẫn tuyệt đối đến thư mục cài đặt WordPress. */
if (!defined('ABSPATH'))
    define('ABSPATH', dirname(__FILE__) . '/');

/** Thiết lập biến và include file. */
require_once(ABSPATH . 'wp-settings.php');
