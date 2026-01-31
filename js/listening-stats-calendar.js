// Listening Stats Heatmap Calendar
class ListeningStatsCalendar {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStyles();
        this.createCalendar();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .stats-calendar-btn { position: fixed; top: 260px; right: 20px; width: 45px; height: 45px; background: linear-gradient(135deg, var(--primary-color), rgba(29, 185, 84, 0.6)); border: 2px solid var(--primary-color); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 995; font-size: 18px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
            .stats-calendar-btn:hover { transform: scale(1.1); }
            .stats-calendar { position: fixed; top: 320px; right: 20px; background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(29, 185, 84, 0.3); border-radius: 12px; padding: 1rem; min-width: 280px; z-index: 996; display: none; backdrop-filter: blur(10px); }
            .stats-calendar.open { display: block; animation: slideDown 0.3s ease; }
            .calendar-title { color: var(--primary-color); font-weight: bold; margin-bottom: 1rem; }
            .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.3rem; }
            .calendar-day { width: 30px; height: 30px; border-radius: 4px; background: rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-secondary); }
            .calendar-day.active { background: rgba(29, 185, 84, 0.3); color: var(--primary-color); }
            .calendar-day.hot { background: rgba(29, 185, 84, 0.6); color: white; box-shadow: 0 0 8px rgba(29, 185, 84, 0.6); }
            .calendar-legend { display: flex; gap: 1rem; margin-top: 1rem; font-size: 11px; color: var(--text-secondary); }
            .legend-item { display: flex; align-items: center; gap: 0.3rem; }
            .legend-box { width: 12px; height: 12px; border-radius: 2px; }
        `;
        document.head.appendChild(style);
    }
    
    createCalendar() {
        const btn = document.createElement('button');
        btn.className = 'stats-calendar-btn';
        btn.innerHTML = '📅';
        btn.id = 'statsCalendarBtn';
        document.body.appendChild(btn);
        
        const calendar = document.createElement('div');
        calendar.className = 'stats-calendar';
        calendar.id = 'statsCalendar';
        
        let html = '<div class="calendar-title">Listening Activity</div><div class="calendar-grid">';
        
        for (let i = 0; i < 30; i++) {
            const active = Math.random() > 0.4;
            const hot = Math.random() > 0.8;
            const cls = hot ? 'hot' : active ? 'active' : '';
            html += `<div class="calendar-day ${cls}">${i + 1}</div>`;
        }
        
        html += `</div><div class="calendar-legend">
            <div class="legend-item"><div class="legend-box" style="background: rgba(0,0,0,0.3)"></div>Inactive</div>
            <div class="legend-item"><div class="legend-box" style="background: rgba(29, 185, 84, 0.3)"></div>Active</div>
            <div class="legend-item"><div class="legend-box" style="background: rgba(29, 185, 84, 0.6)"></div>Very Active</div>
        </div>`;
        
        calendar.innerHTML = html;
        document.body.appendChild(calendar);
        
        btn.addEventListener('click', () => {
            calendar.classList.toggle('open');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ListeningStatsCalendar();
});
