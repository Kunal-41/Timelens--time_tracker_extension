# TimeLens ⏱️ – Advanced Productivity Tracker Chrome Extension

**TimeLens** is a modern, feature-rich Chrome extension that intelligently tracks your browsing time and provides comprehensive productivity analytics with beautiful visualizations and insights.

---

## 🚀 Enhanced Features

### ⏲️ **Smart Time Tracking**
- Automatic tracking of time spent on websites
- Pause/Resume functionality for focused work sessions
- Intelligent filtering of system pages and extensions
- Real-time updates across popup and dashboard

### 📊 **Advanced Analytics Dashboard**
- Interactive charts and visualizations using Chart.js
- Productivity score calculation and trending
- Time distribution analysis
- Category-based filtering (Productive/Neutral/Unproductive)

### 🎯 **Productivity Intelligence**
- Extended database of 25+ categorized websites
- Automatic classification of sites as productive/unproductive/neutral
- Smart domain matching for subdomains
- Customizable productivity scoring

### 🎨 **Modern User Interface**
- Clean, responsive design with gradient backgrounds
- Beautiful card-based layout with hover effects
- Professional color scheme and typography
- Mobile-friendly responsive design

### 📈 **Enhanced Popup Experience**
- Quick productivity score at a glance
- Top 5 most visited sites today
- Color-coded productivity indicators
- One-click dashboard access
- Pause/Resume tracking controls

### 💾 **Data Management**
- Local storage with privacy protection
- Data export functionality (JSON format)
- Automatic cleanup of old data (30-day retention)
- Secure clear data functionality

---

## 📂 Project Structure

```
TimeLens/
├── manifest.json           # Extension configuration
├── background.js          # Enhanced service worker
├── content.js            # Content script (future use)
├── icons/               # Extension icons
├── popup/
│   ├── popup.html       # Modern popup interface
│   └── popup.js         # Enhanced popup logic
├── dashboard/
│   ├── dashboard.html   # Advanced analytics dashboard
│   └── dashboard.js     # Charts and data visualization
├── style/
│   └── style.css        # Comprehensive modern styling
└── README.md           # This file
```

---

## 🛠️ Installation Guide

### Local Development Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Kunal-41/TimeLens.git
   cd TimeLens
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions`
   - Enable **Developer Mode** (toggle in top-right)
   - Click **"Load Unpacked"**
   - Select the `TimeLens` folder
   - The extension icon should appear in your toolbar

3. **Start Tracking**
   - Begin browsing normally
   - Click the TimeLens icon to see your stats
   - Visit the dashboard for detailed analytics

---

## 🎯 How It Works

### Smart Categorization
TimeLens automatically categorizes websites into three types:

**🟢 Productive Sites:**
- Development platforms (GitHub, Stack Overflow, MDN)
- Learning platforms (Coursera, Udemy, Khan Academy)
- Work tools (Slack, Trello, Notion, Figma)
- Documentation sites (docs.google.com, developer.mozilla.org)

**🔴 Unproductive Sites:**
- Social media (Facebook, Instagram, Twitter/X, TikTok)
- Entertainment (YouTube, Netflix, Twitch)
- Gaming and casual browsing sites

**🟡 Neutral Sites:**
- All other websites not specifically categorized

### Productivity Score Calculation
Your productivity score is calculated as:
```
(Productive Time / Total Time) × 100
```

### Visual Indicators
- **🟢 70%+**: Excellent productivity (Green badge)
- **🟡 40-69%**: Good productivity (Orange badge)  
- **🔴 <40%**: Needs improvement (Red badge)

---

## 📊 Dashboard Features

### Interactive Charts
- **Time Distribution**: Doughnut chart showing time per website
- **Productivity Breakdown**: Bar chart comparing productive vs unproductive time

### Detailed Analytics
- Total time spent today
- Productive time tracking
- Sites visited counter
- Detailed per-site breakdown with percentages

### Data Export
Export your data as JSON including:
- Summary statistics
- Detailed time breakdown per site
- Category classifications
- Percentage distributions

---

## � Technical Details

### Permissions Used
- `tabs` – Monitor active website changes
- `storage` – Save time data locally
- `activeTab` – Access current tab information
- `alarms` – Automated data cleanup
- `<all_urls>` – Track time on all websites

### Performance Optimized
- Minimal memory footprint
- Efficient data storage
- Automatic cleanup of old data
- Error handling and recovery

### Privacy Focused
- 100% local data storage
- No cloud uploads or external tracking
- No personal information collected
- Data stays on your device

---

## 🎨 UI/UX Highlights

### Design Philosophy
- **Clean & Modern**: Professional gradient-based design
- **Intuitive**: Easy-to-understand visual indicators
- **Responsive**: Works on all screen sizes
- **Accessible**: High contrast and readable fonts

### Color Scheme
- **Primary**: Blue gradients for actions and highlights
- **Success**: Green for productive activities
- **Warning**: Orange for moderate productivity
- **Danger**: Red for unproductive activities
- **Neutral**: Gray tones for supporting elements

---

## 🔮 Future Enhancements

- [ ] Weekly/Monthly trend analysis
- [ ] Custom site categorization
- [ ] Time-based goals and notifications
- [ ] Focus mode with website blocking
- [ ] Team productivity sharing
- [ ] Browser sync across devices
- [ ] Advanced reporting with CSV export

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Test thoroughly before submitting
- Update documentation for new features
- Ensure responsive design compatibility

---

## 👨‍💻 Author

**Kunal Pantawne**  
🌐 [GitHub Profile](https://github.com/Kunal-41)  
📧 Contact for collaboration opportunities

---

## 📄 License

This project is open-source and available under the **MIT License**.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❗ No warranty provided

---

## ⭐ Show Your Support

If TimeLens helps boost your productivity, please consider:
- ⭐ Starring this repository
- 🐛 Reporting issues or bugs
- 💡 Suggesting new features
- 🔄 Sharing with friends and colleagues

---

**Happy Productive Browsing with TimeLens! ⏱️✨**
