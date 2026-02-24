import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  profile = {
    name: 'Pramod Putta',
    role: 'Full Stack Developer',
    bio: 'I build responsive web apps focused on clean UI, usability, and practical features for teams.',
    email: 'pramod24@gmail.com',
    location: 'Andhra Pradesh, India',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML/CSS','MongoDB','Node.js','Express.js'],
  };
}
