# Rockstagram

A photo sharing app for rock climbers

[👉 Live demo 👈](https://rockstagram-9e421.web.app/)

## Functionality
  - The home page is a timeline of all posts made by registered users. The timeline can be returned to by clicking the "Rockstagram" label located in the header.
  - Each registered User has a profile page that can be accessed by clicking on the username of that user.
  - Users can view posts, profiles, and comments without being logged in.
  - Logged in Users can post images with captions, comment on other's posts, and like other's posts.
  - Logged in Users can edit their profile description and avatar image from their profile page.
  - Logged in Users can delete their own posts and comments.

## Reflection
  This project was designed to replicate some of the core functionality of popular photo showing apps. 

  I learned a lot about configuring components to properly pass states and functions around. 

  React router helped me facilitate page navigation between the timeline and user pages.

## Screenshot
![screenshot](/src/components/images/screenshot.png?raw=true)

## Notes
  - This project uses Firebase as a backend service. Services used include: authentication, firestore database, and storage.
  - This was built as part of the Odin Project curriculum. [Project description](https://www.theodinproject.com/lessons/javascript-javascript-final-project)