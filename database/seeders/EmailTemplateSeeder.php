<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use App\Models\EmailTemplateLang;
use App\Models\UserEmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $languages = json_decode(file_get_contents(resource_path('lang/language.json')), true);
        $langCodes = collect($languages)->pluck('code')->toArray();

        $baseTranslations = [
            'Order Created' => [
                'en' => ['subject' => 'Order Complete', 'content' => '<p>Hello,</p><p>Welcome to {app_name}.</p><p>Hi, {order_name}, Thank you for Shopping</p><p>We received your purchase request, we\'ll be in touch shortly!</p><p>Thanks,</p><p>{app_name}</p><p>{order_url}</p>'],
                'es' => ['subject' => 'Pedido Completado', 'content' => '<p>Hola,</p><p>Bienvenido a {app_name}.</p><p>Hola, {order_name}, Gracias por comprar</p><p>Recibimos su solicitud de compra, ¡estaremos en contacto en breve!</p><p>Gracias,</p><p>{app_name}</p><p>{order_url}</p>'],
                'ar' => ['subject' => 'اكتمال الطلب', 'content' => '<p>مرحبا،</p><p>مرحبا بك في {app_name}.</p><p>مرحبا، {order_name}، شكرا لك على التسوق</p><p>لقد تلقينا طلب الشراء الخاص بك، سنتواصل معك قريبا!</p><p>شكرا،</p><p>{app_name}</p><p>{order_url}</p>'],
                'da' => ['subject' => 'Ordre Fuldført', 'content' => '<p>Hej,</p><p>Velkommen til {app_name}.</p><p>Hej, {order_name}, Tak for at handle</p><p>Vi modtog din købsanmodning, vi kontakter dig snart!</p><p>Tak,</p><p>{app_name}</p><p>{order_url}</p>'],
                'de' => ['subject' => 'Bestellung Abgeschlossen', 'content' => '<p>Hallo,</p><p>Willkommen bei {app_name}.</p><p>Hallo, {order_name}, Danke fürs Einkaufen</p><p>Wir haben Ihre Kaufanfrage erhalten, wir melden uns bald!</p><p>Danke,</p><p>{app_name}</p><p>{order_url}</p>'],
                'fr' => ['subject' => 'Commande Terminée', 'content' => '<p>Bonjour,</p><p>Bienvenue dans {app_name}.</p><p>Salut, {order_name}, Merci pour vos achats</p><p>Nous avons reçu votre demande d\'achat, nous vous contacterons bientôt!</p><p>Merci,</p><p>{app_name}</p><p>{order_url}</p>'],
                'he' => ['subject' => 'הזמנה הושלמה', 'content' => '<p>שלום,</p><p>ברוכים הבאים ל-{app_name}.</p><p>שלום, {order_name}, תודה על הקנייה</p><p>קיבלנו את בקשת הרכישה שלך, נחזור אליך בקרוב!</p><p>תודה,</p><p>{app_name}</p><p>{order_url}</p>'],
                'it' => ['subject' => 'Ordine Completato', 'content' => '<p>Ciao,</p><p>Benvenuto in {app_name}.</p><p>Ciao, {order_name}, Grazie per aver fatto acquisti</p><p>Abbiamo ricevuto la tua richiesta di acquisto, ti contatteremo presto!</p><p>Grazie,</p><p>{app_name}</p><p>{order_url}</p>'],
                'ja' => ['subject' => '注文完了', 'content' => '<p>こんにちは、</p><p>{app_name}へようこそ。</p><p>こんにちは、{order_name}さん、お買い物ありがとうございます</p><p>ご購入リクエストを受け取りました。すぐにご連絡いたします！</p><p>ありがとうございます、</p><p>{app_name}</p><p>{order_url}</p>'],
                'nl' => ['subject' => 'Bestelling Voltooid', 'content' => '<p>Hallo,</p><p>Welkom bij {app_name}.</p><p>Hallo, {order_name}, Bedankt voor het winkelen</p><p>We hebben je aankoopverzoek ontvangen, we nemen binnenkort contact op!</p><p>Bedankt,</p><p>{app_name}</p><p>{order_url}</p>'],
                'pl' => ['subject' => 'Zamówienie Zakończone', 'content' => '<p>Cześć,</p><p>Witamy w {app_name}.</p><p>Cześć, {order_name}, Dziękujemy za zakupy</p><p>Otrzymaliśmy Twoje żądanie zakupu, wkrótce się skontaktujemy!</p><p>Dzięki,</p><p>{app_name}</p><p>{order_url}</p>'],
                'pt' => ['subject' => 'Pedido Completo', 'content' => '<p>Olá,</p><p>Bem-vindo ao {app_name}.</p><p>Olá, {order_name}, Obrigado por comprar</p><p>Recebemos seu pedido de compra, entraremos em contato em breve!</p><p>Obrigado,</p><p>{app_name}</p><p>{order_url}</p>'],
                'pt-BR' => ['subject' => 'Pedido Completo', 'content' => '<p>Olá,</p><p>Bem-vindo ao {app_name}.</p><p>Olá, {order_name}, Obrigado por comprar</p><p>Recebemos sua solicitação de compra, entraremos em contato em breve!</p><p>Obrigado,</p><p>{app_name}</p><p>{order_url}</p>'],
                'ru' => ['subject' => 'Заказ Завершен', 'content' => '<p>Привет,</p><p>Добро пожаловать в {app_name}.</p><p>Привет, {order_name}, Спасибо за покупку</p><p>Мы получили ваш запрос на покупку, скоро свяжемся с вами!</p><p>Спасибо,</p><p>{app_name}</p><p>{order_url}</p>'],
                'tr' => ['subject' => 'Sipariş Tamamlandı', 'content' => '<p>Merhaba,</p><p>{app_name}\'e hoş geldiniz.</p><p>Merhaba, {order_name}, Alışveriş yaptığınız için teşekkürler</p><p>Satın alma talebinizi aldık, yakında sizinle iletişime geçeceğiz!</p><p>Teşekkürler,</p><p>{app_name}</p><p>{order_url}</p>'],
                'zh' => ['subject' => '订单完成', 'content' => '<p>你好，</p><p>欢迎来到{app_name}。</p><p>你好，{order_name}，感谢您的购买</p><p>我们收到了您的购买请求，我们很快会联系您！</p><p>谢谢，</p><p>{app_name}</p><p>{order_url}</p>']
            ],
            'Order Created For Owner' => [
                'en' => ['subject' => 'Order Detail', 'content' => '<p>Hello,</p><p>Dear {owner_name}.</p><p>This is Confirmation Order {order_id} place on <span style="font-size: 1rem;">{order_date}.</span></p><p>Thanks,</p><p>{order_url}</p>'],
                'es' => ['subject' => 'Detalle del Pedido', 'content' => '<p>Hola,</p><p>Estimado {owner_name}.</p><p>Esta es la confirmación del pedido {order_id} realizado el <span style="font-size: 1rem;">{order_date}.</span></p><p>Gracias,</p><p>{order_url}</p>'],
                'ar' => ['subject' => 'تفاصيل الطلب', 'content' => '<p>مرحبا،</p><p>عزيزي {owner_name}.</p><p>هذا تأكيد الطلب {order_id} المقدم في <span style="font-size: 1rem;">{order_date}.</span></p><p>شكرا،</p><p>{order_url}</p>'],
                'da' => ['subject' => 'Ordre Detaljer', 'content' => '<p>Hej,</p><p>Kære {owner_name}.</p><p>Dette er bekræftelse af ordre {order_id} afgivet den <span style="font-size: 1rem;">{order_date}.</span></p><p>Tak,</p><p>{order_url}</p>'],
                'de' => ['subject' => 'Bestelldetails', 'content' => '<p>Hallo,</p><p>Lieber {owner_name}.</p><p>Dies ist die Bestätigung der Bestellung {order_id} vom <span style="font-size: 1rem;">{order_date}.</span></p><p>Danke,</p><p>{order_url}</p>'],
                'fr' => ['subject' => 'Détail de la Commande', 'content' => '<p>Bonjour,</p><p>Cher {owner_name}.</p><p>Ceci est la confirmation de commande {order_id} passée le <span style="font-size: 1rem;">{order_date}.</span></p><p>Merci,</p><p>{order_url}</p>'],
                'he' => ['subject' => 'פרטי הזמנה', 'content' => '<p>שלום,</p><p>יקר {owner_name}.</p><p>זהו אישור הזמנה {order_id} שהוגשה ב-<span style="font-size: 1rem;">{order_date}.</span></p><p>תודה,</p><p>{order_url}</p>'],
                'it' => ['subject' => 'Dettagli Ordine', 'content' => '<p>Ciao,</p><p>Caro {owner_name}.</p><p>Questa è la conferma dell\'ordine {order_id} effettuato il <span style="font-size: 1rem;">{order_date}.</span></p><p>Grazie,</p><p>{order_url}</p>'],
                'ja' => ['subject' => '注文詳細', 'content' => '<p>こんにちは、</p><p>{owner_name}様。</p><p>これは<span style="font-size: 1rem;">{order_date}</span>に行われた注文{order_id}の確認です。</p><p>ありがとうございます、</p><p>{order_url}</p>'],
                'nl' => ['subject' => 'Bestelling Details', 'content' => '<p>Hallo,</p><p>Beste {owner_name}.</p><p>Dit is bevestiging van bestelling {order_id} geplaatst op <span style="font-size: 1rem;">{order_date}.</span></p><p>Bedankt,</p><p>{order_url}</p>'],
                'pl' => ['subject' => 'Szczegóły Zamówienia', 'content' => '<p>Cześć,</p><p>Drogi {owner_name}.</p><p>To jest potwierdzenie zamówienia {order_id} złożonego <span style="font-size: 1rem;">{order_date}.</span></p><p>Dzięki,</p><p>{order_url}</p>'],
                'pt' => ['subject' => 'Detalhes do Pedido', 'content' => '<p>Olá,</p><p>Caro {owner_name}.</p><p>Esta é a confirmação do pedido {order_id} feito em <span style="font-size: 1rem;">{order_date}.</span></p><p>Obrigado,</p><p>{order_url}</p>'],
                'pt-BR' => ['subject' => 'Detalhes do Pedido', 'content' => '<p>Olá,</p><p>Caro {owner_name}.</p><p>Esta é a confirmação do pedido {order_id} feito em <span style="font-size: 1rem;">{order_date}.</span></p><p>Obrigado,</p><p>{order_url}</p>'],
                'ru' => ['subject' => 'Детали Заказа', 'content' => '<p>Привет,</p><p>Дорогой {owner_name}.</p><p>Это подтверждение заказа {order_id}, размещенного <span style="font-size: 1rem;">{order_date}.</span></p><p>Спасибо,</p><p>{order_url}</p>'],
                'tr' => ['subject' => 'Sipariş Detayları', 'content' => '<p>Merhaba,</p><p>Sayın {owner_name}.</p><p>Bu, <span style="font-size: 1rem;">{order_date}</span> tarihinde verilen {order_id} siparişinin onayıdır.</p><p>Teşekkürler,</p><p>{order_url}</p>'],
                'zh' => ['subject' => '订单详情', 'content' => '<p>你好，</p><p>亲爱的{owner_name}。</p><p>这是在<span style="font-size: 1rem;">{order_date}</span>下的订单{order_id}的确认。</p><p>谢谢，</p><p>{order_url}</p>']
            ],
            'Owner And Store Created' => [
                'en' => ['subject' => 'Owner And Store Detail', 'content' => '<p>Hello,<b> {owner_name} </b>!</p><p>Welcome to our app your login detail for <b> {app_name}</b> is <br></p><p><b>Email : </b>{owner_email}</p><p><b>Password : </b>{owner_password}</p><p><b>App url : </b>{app_url}</p><p><b>Store url : </b>{store_url}</p><p>Thank you for connecting with us,</p><p>{app_name}</p>'],
                'es' => ['subject' => 'Detalles del Propietario y Tienda', 'content' => '<p>¡Hola,<b> {owner_name} </b>!</p><p>Bienvenido a nuestra aplicación, sus detalles de inicio de sesión para <b> {app_name}</b> son <br></p><p><b>Email : </b>{owner_email}</p><p><b>Contraseña : </b>{owner_password}</p><p><b>URL de la aplicación : </b>{app_url}</p><p><b>URL de la tienda : </b>{store_url}</p><p>Gracias por conectarse con nosotros,</p><p>{app_name}</p>'],
                'ar' => ['subject' => 'تفاصيل المالك والمتجر', 'content' => '<p>مرحبا،<b> {owner_name} </b>!</p><p>مرحبا بك في تطبيقنا، تفاصيل تسجيل الدخول الخاصة بك لـ <b> {app_name}</b> هي <br></p><p><b>البريد الإلكتروني : </b>{owner_email}</p><p><b>كلمة المرور : </b>{owner_password}</p><p><b>رابط التطبيق : </b>{app_url}</p><p><b>رابط المتجر : </b>{store_url}</p><p>شكرا لك على التواصل معنا،</p><p>{app_name}</p>'],
                'da' => ['subject' => 'Ejer og Butik Detaljer', 'content' => '<p>Hej,<b> {owner_name} </b>!</p><p>Velkommen til vores app, dine login detaljer for <b> {app_name}</b> er <br></p><p><b>Email : </b>{owner_email}</p><p><b>Adgangskode : </b>{owner_password}</p><p><b>App url : </b>{app_url}</p><p><b>Butik url : </b>{store_url}</p><p>Tak for at forbinde med os,</p><p>{app_name}</p>'],
                'de' => ['subject' => 'Eigentümer und Shop Details', 'content' => '<p>Hallo,<b> {owner_name} </b>!</p><p>Willkommen in unserer App, Ihre Anmeldedaten für <b> {app_name}</b> sind <br></p><p><b>E-Mail : </b>{owner_email}</p><p><b>Passwort : </b>{owner_password}</p><p><b>App-URL : </b>{app_url}</p><p><b>Shop-URL : </b>{store_url}</p><p>Vielen Dank für die Verbindung mit uns,</p><p>{app_name}</p>'],
                'fr' => ['subject' => 'Détails du Propriétaire et du Magasin', 'content' => '<p>Bonjour,<b> {owner_name} </b>!</p><p>Bienvenue dans notre application, vos détails de connexion pour <b> {app_name}</b> sont <br></p><p><b>Email : </b>{owner_email}</p><p><b>Mot de passe : </b>{owner_password}</p><p><b>URL de l\'application : </b>{app_url}</p><p><b>URL du magasin : </b>{store_url}</p><p>Merci de vous connecter avec nous,</p><p>{app_name}</p>'],
                'he' => ['subject' => 'פרטי בעלים וחנות', 'content' => '<p>שלום,<b> {owner_name} </b>!</p><p>ברוכים הבאים לאפליקציה שלנו, פרטי ההתחברות שלך ל-<b> {app_name}</b> הם <br></p><p><b>אימייל : </b>{owner_email}</p><p><b>סיסמה : </b>{owner_password}</p><p><b>כתובת האפליקציה : </b>{app_url}</p><p><b>כתובת החנות : </b>{store_url}</p><p>תודה על ההתחברות אלינו,</p><p>{app_name}</p>'],
                'it' => ['subject' => 'Dettagli Proprietario e Negozio', 'content' => '<p>Ciao,<b> {owner_name} </b>!</p><p>Benvenuto nella nostra app, i tuoi dettagli di accesso per <b> {app_name}</b> sono <br></p><p><b>Email : </b>{owner_email}</p><p><b>Password : </b>{owner_password}</p><p><b>URL app : </b>{app_url}</p><p><b>URL negozio : </b>{store_url}</p><p>Grazie per esserti connesso con noi,</p><p>{app_name}</p>'],
                'ja' => ['subject' => 'オーナーとストアの詳細', 'content' => '<p>こんにちは、<b> {owner_name} </b>さん！</p><p>私たちのアプリへようこそ。<b> {app_name}</b>のログイン詳細は <br></p><p><b>メール : </b>{owner_email}</p><p><b>パスワード : </b>{owner_password}</p><p><b>アプリURL : </b>{app_url}</p><p><b>ストアURL : </b>{store_url}</p><p>私たちとつながっていただき、ありがとうございます。</p><p>{app_name}</p>'],
                'nl' => ['subject' => 'Eigenaar en Winkel Details', 'content' => '<p>Hallo,<b> {owner_name} </b>!</p><p>Welkom bij onze app, je inloggegevens voor <b> {app_name}</b> zijn <br></p><p><b>Email : </b>{owner_email}</p><p><b>Wachtwoord : </b>{owner_password}</p><p><b>App url : </b>{app_url}</p><p><b>Winkel url : </b>{store_url}</p><p>Bedankt voor het verbinden met ons,</p><p>{app_name}</p>'],
                'pl' => ['subject' => 'Szczegóły Właściciela i Sklepu', 'content' => '<p>Cześć,<b> {owner_name} </b>!</p><p>Witamy w naszej aplikacji, Twoje dane logowania do <b> {app_name}</b> to <br></p><p><b>Email : </b>{owner_email}</p><p><b>Hasło : </b>{owner_password}</p><p><b>URL aplikacji : </b>{app_url}</p><p><b>URL sklepu : </b>{store_url}</p><p>Dziękujemy za połączenie z nami,</p><p>{app_name}</p>'],
                'pt' => ['subject' => 'Detalhes do Proprietário e Loja', 'content' => '<p>Olá,<b> {owner_name} </b>!</p><p>Bem-vindo ao nosso app, seus detalhes de login para <b> {app_name}</b> são <br></p><p><b>Email : </b>{owner_email}</p><p><b>Senha : </b>{owner_password}</p><p><b>URL do app : </b>{app_url}</p><p><b>URL da loja : </b>{store_url}</p><p>Obrigado por se conectar conosco,</p><p>{app_name}</p>'],
                'pt-BR' => ['subject' => 'Detalhes do Proprietário e Loja', 'content' => '<p>Olá,<b> {owner_name} </b>!</p><p>Bem-vindo ao nosso app, seus detalhes de login para <b> {app_name}</b> são <br></p><p><b>Email : </b>{owner_email}</p><p><b>Senha : </b>{owner_password}</p><p><b>URL do app : </b>{app_url}</p><p><b>URL da loja : </b>{store_url}</p><p>Obrigado por se conectar conosco,</p><p>{app_name}</p>'],
                'ru' => ['subject' => 'Детали Владельца и Магазина', 'content' => '<p>Привет,<b> {owner_name} </b>!</p><p>Добро пожаловать в наше приложение, ваши данные для входа в <b> {app_name}</b> <br></p><p><b>Email : </b>{owner_email}</p><p><b>Пароль : </b>{owner_password}</p><p><b>URL приложения : </b>{app_url}</p><p><b>URL магазина : </b>{store_url}</p><p>Спасибо за связь с нами,</p><p>{app_name}</p>'],
                'tr' => ['subject' => 'Sahip ve Mağaza Detayları', 'content' => '<p>Merhaba,<b> {owner_name} </b>!</p><p>Uygulamamıza hoş geldiniz, <b> {app_name}</b> için giriş bilgileriniz <br></p><p><b>Email : </b>{owner_email}</p><p><b>Şifre : </b>{owner_password}</p><p><b>Uygulama url : </b>{app_url}</p><p><b>Mağaza url : </b>{store_url}</p><p>Bizimle bağlantı kurduğunuz için teşekkürler,</p><p>{app_name}</p>'],
                'zh' => ['subject' => '店主和商店详情', 'content' => '<p>你好，<b> {owner_name} </b>！</p><p>欢迎使用我们的应用，您的<b> {app_name}</b>登录详情是 <br></p><p><b>邮箱 : </b>{owner_email}</p><p><b>密码 : </b>{owner_password}</p><p><b>应用网址 : </b>{app_url}</p><p><b>商店网址 : </b>{store_url}</p><p>感谢您与我们联系，</p><p>{app_name}</p>']
            ],
            'Status Change' => [
                'en' => ['subject' => 'Order Status', 'content' => '<p>Hello,</p><p>Welcome to {app_name}.</p><p>Your Order is {order_status}!</p><p>Hi {order_name}, Thank you for Shopping</p><p>Thanks,</p><p>{app_name}</p><p>{order_url}</p>'],
                'es' => ['subject' => 'Estado del Pedido', 'content' => '<p>Hola,</p><p>Bienvenido a {app_name}.</p><p>¡Su pedido está {order_status}!</p><p>Hola {order_name}, Gracias por comprar</p><p>Gracias,</p><p>{app_name}</p><p>{order_url}</p>'],
                'ar' => ['subject' => 'حالة الطلب', 'content' => '<p>مرحبا،</p><p>مرحبا بك في {app_name}.</p><p>طلبك {order_status}!</p><p>مرحبا {order_name}، شكرا لك على التسوق</p><p>شكرا،</p><p>{app_name}</p><p>{order_url}</p>'],
                'da' => ['subject' => 'Ordre Status', 'content' => '<p>Hej,</p><p>Velkommen til {app_name}.</p><p>Din ordre er {order_status}!</p><p>Hej {order_name}, Tak for at handle</p><p>Tak,</p><p>{app_name}</p><p>{order_url}</p>'],
                'de' => ['subject' => 'Bestellstatus', 'content' => '<p>Hallo,</p><p>Willkommen bei {app_name}.</p><p>Ihre Bestellung ist {order_status}!</p><p>Hallo {order_name}, Danke fürs Einkaufen</p><p>Danke,</p><p>{app_name}</p><p>{order_url}</p>'],
                'fr' => ['subject' => 'Statut de la Commande', 'content' => '<p>Bonjour,</p><p>Bienvenue dans {app_name}.</p><p>Votre commande est {order_status}!</p><p>Salut {order_name}, Merci pour vos achats</p><p>Merci,</p><p>{app_name}</p><p>{order_url}</p>'],
                'he' => ['subject' => 'סטטוס הזמנה', 'content' => '<p>שלום,</p><p>ברוכים הבאים ל-{app_name}.</p><p>ההזמנה שלך {order_status}!</p><p>שלום {order_name}, תודה על הקנייה</p><p>תודה,</p><p>{app_name}</p><p>{order_url}</p>'],
                'it' => ['subject' => 'Stato Ordine', 'content' => '<p>Ciao,</p><p>Benvenuto in {app_name}.</p><p>Il tuo ordine è {order_status}!</p><p>Ciao {order_name}, Grazie per aver fatto acquisti</p><p>Grazie,</p><p>{app_name}</p><p>{order_url}</p>'],
                'ja' => ['subject' => '注文ステータス', 'content' => '<p>こんにちは、</p><p>{app_name}へようこそ。</p><p>あなたの注文は{order_status}です！</p><p>こんにちは{order_name}さん、お買い物ありがとうございます</p><p>ありがとうございます、</p><p>{app_name}</p><p>{order_url}</p>'],
                'nl' => ['subject' => 'Bestelling Status', 'content' => '<p>Hallo,</p><p>Welkom bij {app_name}.</p><p>Je bestelling is {order_status}!</p><p>Hallo {order_name}, Bedankt voor het winkelen</p><p>Bedankt,</p><p>{app_name}</p><p>{order_url}</p>'],
                'pl' => ['subject' => 'Status Zamówienia', 'content' => '<p>Cześć,</p><p>Witamy w {app_name}.</p><p>Twoje zamówienie jest {order_status}!</p><p>Cześć {order_name}, Dziękujemy za zakupy</p><p>Dzięki,</p><p>{app_name}</p><p>{order_url}</p>'],
                'pt' => ['subject' => 'Status do Pedido', 'content' => '<p>Olá,</p><p>Bem-vindo ao {app_name}.</p><p>Seu pedido está {order_status}!</p><p>Olá {order_name}, Obrigado por comprar</p><p>Obrigado,</p><p>{app_name}</p><p>{order_url}</p>'],
                'pt-BR' => ['subject' => 'Status do Pedido', 'content' => '<p>Olá,</p><p>Bem-vindo ao {app_name}.</p><p>Seu pedido está {order_status}!</p><p>Olá {order_name}, Obrigado por comprar</p><p>Obrigado,</p><p>{app_name}</p><p>{order_url}</p>'],
                'ru' => ['subject' => 'Статус Заказа', 'content' => '<p>Привет,</p><p>Добро пожаловать в {app_name}.</p><p>Ваш заказ {order_status}!</p><p>Привет {order_name}, Спасибо за покупку</p><p>Спасибо,</p><p>{app_name}</p><p>{order_url}</p>'],
                'tr' => ['subject' => 'Sipariş Durumu', 'content' => '<p>Merhaba,</p><p>{app_name}\'e hoş geldiniz.</p><p>Siparişiniz {order_status}!</p><p>Merhaba {order_name}, Alışveriş yaptığınız için teşekkürler</p><p>Teşekkürler,</p><p>{app_name}</p><p>{order_url}</p>'],
                'zh' => ['subject' => '订单状态', 'content' => '<p>你好，</p><p>欢迎来到{app_name}。</p><p>您的订单是{order_status}！</p><p>你好{order_name}，感谢您的购买</p><p>谢谢，</p><p>{app_name}</p><p>{order_url}</p>']
            ]
        ];

        $templates = [];
        foreach ($baseTranslations as $templateName => $translations) {
            $templates[] = [
                'name' => $templateName,
                'from' => config('app.name'),
                'translations' => $translations
            ];
        };

        foreach ($templates as $templateData) {
            // Check if template already exists
            $existingTemplate = EmailTemplate::where('name', $templateData['name'])
                ->where('user_id', 1)
                ->first();
                
            if (!$existingTemplate) {
                $template = EmailTemplate::create([
                    'name' => $templateData['name'],
                    'from' => $templateData['from'],
                    'user_id' => 1
                ]);

                foreach ($langCodes as $langCode) {
                    $translation = $templateData['translations'][$langCode] ?? $templateData['translations']['en'];
                    
                    EmailTemplateLang::create([
                        'parent_id' => $template->id,
                        'lang' => $langCode,
                        'subject' => $translation['subject'],
                        'content' => $translation['content']
                    ]);
                }

                UserEmailTemplate::create([
                    'template_id' => $template->id,
                    'user_id' => 1,
                    'is_active' => true
                ]);
            }
        }
    }
}
