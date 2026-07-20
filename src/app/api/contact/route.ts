import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, subject, message } = await request.json();

    // Authentification SMTP sécurisée via le compte Gmail testé
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anoeddi84@gmail.com',
        pass: 'zekm cdnj byuh fxjn', // Mot de passe d'application Google validé
      },
    });

    const mailOptions = {
      from: '"AnimaeLumen Contact" <anoeddi84@gmail.com>', // Libellé neutre d'envoi
      to: 'animaelumen@outlook.com', // Destinataire final officiel
      replyTo: email, // Permet au destinataire de répondre directement à l'internaute
      subject: `[AnimaeLumen] Nouveau message : ${subject}`,
      html: `
        <h3>Nouveau message de contact reçu</h3>
        <p><strong>Nom complet :</strong> ${firstName} ${lastName}</p>
        <p><strong>Email de l'internaute :</strong> ${email}</p> 
        <p><strong>Sujet :</strong> ${subject}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
