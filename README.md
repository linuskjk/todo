# ✅ Self-Hosted ToDo Web App

A beautiful and fast web-based ToDo list app, fully self-hosted on your own NAS. No external dependencies like Firebase – all your data stays private and secure, hosted right on your Synology (or any) server.

🌐 **Live Demo**: [linuskjk.synology.me/todoapp](https://linuskjk.synology.me/todoapp)

---

## 🚀 Features

- 📝 Create, edit, complete, and delete tasks
- 🧠 Remembers your data even after refreshing the page
- 📤 Share task lists via links or codes
- 🔁 Real-time collaboration with optional live sync mode
- 🔒 Choose read-only or full edit permissions when sharing
- 📋 Multiple named task lists with emojis
- 🎨 Modern and responsive design
- 🧪 Offline Demo Mode without login
- 💾 Fully self-hosted, no third-party cloud storage

---

## 🛠 How It Works

- Tasks are stored securely on your NAS using server-side JSON files.
- You can access your task lists from any device with a browser.
- Sharing is easy: create a shareable link or code to invite others.
- Live sync mode ensures real-time updates between devices.

---

## 📁 Project Structure

/todoapp
├── index.html
├── css/
│ └── style.css
├── js/
│ └── main.js
├── server/
│ ├── save.php
│ ├── load.php
│ ├── share.php
│ ├── list.php
│ └── config.php
└── data/
└── (lists and config saved here)

yaml
Copy
Edit

---

## ⚙️ Installation (on Synology NAS)

1. **Enable Web Station and PHP** on your Synology
2. **Place the `todoapp/` folder** inside the `/web/` directory
3. Visit `http://your-nas.local/todoapp` or your custom domain
4. You're ready to go! 🎉

---

## 🧪 Demo Mode

Try the app without any setup:

- Visit [linuskjk.synology.me/todoapp](https://linuskjk.synology.me/todoapp)
- Click **"Demo Mode"**
- Play around with all features (no data saved)

---

## 💡 Planned Features

- [ ] Dark Mode toggle 🌙
- [ ] Mobile-friendly progressive web app (PWA)
- [ ] Offline access + sync
- [ ] Task notifications & reminders
- [ ] Drag-and-drop reordering

---

## 🧑‍💻 Built With

- HTML5 / CSS3 / JavaScript
- PHP for server logic
- JSON file-based storage
- Hosted on Synology DS920+ (Web Station)

---

## 🙋 Feedback

Try it and let me know what you think!  
Just leave feedback at [linuskjk.synology.me/todoapp](https://linuskjk.synology.me/todoapp)  
or message me directly.

---

## 📜 License

This project is open-source and free to use for personal or educational purposes.
