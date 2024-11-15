from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def notify_admin_creation(instance, password):
    context = {
        'current_user': instance.user_id,
        'email': instance.email,
        'token': password
    }

    html_message = render_to_string("pruebaplantilla.html", context)
    email_plaintext_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        "Creación de cuenta - {title}".format(title="WingCol"),
        email_plaintext_message,
        "wingcolairlines@gmail.com",
        [instance.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()