<?php
namespace App\Library;

/**
 * Class Mail para el manejador de envio de correos
 *
 * @author: Isabel Nieto;
 * @email: isabelcnd@gmail.com
 * @version: 17/10/2017
 */

use Phalcon\Mvc\View;

class Mail extends \Phalcon\Mvc\User\Component
{
    protected $_transport;

    public function getTransport()
    {
        return $this->_transport;
    }

    /**
     * Busca y aplica una plantilla a ser enviada al correo
     *
     * @param string $name
     * @param array $params
     * @return string
     */
    public function getTemplate($name, $params)
    {
        return $this->view->getRender('emailTemplates', $name, $params, function($view){
            $view->setRenderLevel(View::LEVEL_LAYOUT);
        });
    }
    /**
     * Funcion que envía correos en base a los parametros predefinidos en el config.php
     *
     * @param array $to a quien se le envia
     * @param string $subject el titulo del correo
     * @param array $params
     * @param string $nameControllerAction nombre de la accion que el controllador ejecutara
     * @return object 1 = enviado, cualquier otro numero de lo contrario
     */
    public function send($to=null, $subject=null, $emailtemplate=null, $params=null)
    {
        //Obtenemos los datos de configuracion del correo
        $emailtemplate = is_null($emailtemplate) ? "baseEmail" : $emailtemplate;
        $parameters = is_null($params) ? [] : $params;
        $mailSettings = $this->config->mail;
        $template = $this->getTemplate($emailtemplate, $params);

        // Creamos el objeto mensaje
        $message = new \Swift_Message();

        // Asignamos los parametros para el envio del correo
        $message
            ->setSubject($subject)
            ->setTo($to)
            ->setFrom([
                $mailSettings->fromEmail => $mailSettings->fromName
            ])
            ->setBody($template, 'text/html');

        // Asignamos los parametros para el envio de correos.
        if (!$this->_transport) {
            $transport = new \Swift_SmtpTransport(
                $mailSettings->smtp->server,
                $mailSettings->smtp->port,
                $mailSettings->smtp->security
            );

            $this->_transport = $transport
                ->setUsername($mailSettings->smtp->username)
                ->setPassword($mailSettings->smtp->password);
        }
        // Creamos finalmente el objeto SwiftMailer y lo enviamos
        $mailer = new \Swift_Mailer($this->_transport);
        if($this->config->environment === 'production'){
            return $mailer->send($message);
        }
    }
}