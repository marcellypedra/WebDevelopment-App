import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'roster-management-app';
}

/*
  emailjs.send("service_hoxokcn","template_g52ztqp",{
    from_name: "Team Roster Management",
    to_name: "you",
    from_email: "20058225@mydbs.ie",
    subject: "Test Subject",
    message: "This is message",
  });
*/