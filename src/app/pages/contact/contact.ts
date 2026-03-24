import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  highlights = [
    { title: 'Response Window', value: 'Within 24 Hours' },
    { title: 'Best For', value: 'Teams & Students' },
    { title: 'Focus', value: 'Productive Collaboration' },
  ];

  channels = [
    {
      title: 'Project Guidance',
      badge: 'Popular',
      description: 'Get help understanding workflows, dashboard insights, and the best way to organize tasks across a team.',
    },
    {
      title: 'Feature Feedback',
      badge: 'Open',
      description: 'Share ideas for improving usability, design, analytics, and task coordination features inside TaskFlow.',
    },
    {
      title: 'Academic Demo',
      badge: 'Campus',
      description: 'Use this page for classroom presentations, reviews, and project discussions without exposing personal contact details.',
    },
  ];

  contactPoints = [
    { label: 'Support Channel', value: 'support@taskflow.app' },
    { label: 'Project Desk', value: 'TaskFlow Product Team' },
    { label: 'Availability', value: 'Mon - Fri, 9:00 AM to 6:00 PM' },
  ];
}
