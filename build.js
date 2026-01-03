const fs = require('fs').promises;
const path = require('path');

async function build() {
  try {
    // 1. Read all the necessary files
    const talksData = await fs.readFile('talks.json', 'utf-8');
    const talks = JSON.parse(talksData);
    
    const css = await fs.readFile('style.css', 'utf-8');
    const js = await fs.readFile('script.js', 'utf-8');
    let template = await fs.readFile('template.html', 'utf-8');

    // 2. Generate the schedule HTML
    const scheduleHtml = generateSchedule(talks);

    // 3. Inject CSS, JS, and the schedule into the template
    template = template.replace('/* CSS will be injected here */', css);
    template = template.replace('// JavaScript will be injected here', js);
    template = template.replace('<!-- Schedule will be injected here -->', scheduleHtml);

    // 4. Create a dist directory if it doesn't exist
    const distDir = 'dist';
    try {
      await fs.mkdir(distDir);
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    // 5. Write the final index.html file
    await fs.writeFile(path.join(distDir, 'index.html'), template);
    console.log('Website successfully built to dist/index.html');

  } catch (error) {
    console.error('Error building the website:', error);
  }
}

function generateSchedule(talks) {
  const schedule = [
    { time: '10:00 - 11:00', talk: talks[0] },
    { time: '11:00 - 11:10', break: 'Transition' },
    { time: '11:10 - 12:10', talk: talks[1] },
    { time: '12:10 - 12:20', break: 'Transition' },
    { time: '12:20 - 13:20', talk: talks[2] },
    { time: '13:20 - 14:20', break: 'Lunch Break' },
    { time: '14:20 - 15:20', talk: talks[3] },
    { time: '15:20 - 15:30', break: 'Transition' },
    { time: '15:30 - 16:30', talk: talks[4] },
    { time: '16:30 - 16:40', break: 'Transition' },
    { time: '16:40 - 17:40', talk: talks[5] },
  ];

  return schedule.map(item => {
    if (item.talk) {
      const { title, speakers, category, description } = item.talk;
      const categoriesString = category.join(', ');
      return `
        <div class="schedule-item">
          <div class="time-slot">${item.time}</div>
          <div class="talk-card" data-categories="${categoriesString}">
            <h2>${title}</h2>
            <div class="speakers">By: ${speakers.join(', ')}</div>
            <div class="categories">
              ${category.map(c => `<span class="category">${c}</span>`).join('')}
            </div>
            <p class="description">${description}</p>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="schedule-item">
          <div class="time-slot">${item.time}</div>
          <div class="talk-card break">${item.break}</div>
        </div>
      `;
    }
  }).join('');
}

build();
