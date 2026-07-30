let Style = {
    iPhone:{ //16
        "width": "393px",
    },
    tekiou: function() {
        for (let section in this) {
            if (section == 'apply') continue;
            for (let key in this[section]) {
                document.documentElement.style
                    .setProperty(`--${section}-${key}`, this[section][key]);
            }
        }
    }
}
