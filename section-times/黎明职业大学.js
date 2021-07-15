(function () {
    const mouth = new Date().getMonth() + 1;
    return mouth >= 6 && mouth <= 9 ? [
        {"section":1,"startTime":"08:00","endTime":"08:45"},
        {"section":2,"startTime":"08:55","endTime":"09:40"},
        {"section":3,"startTime":"10:00","endTime":"10:45"},
        {"section":4,"startTime":"10:55","endTime":"11:40"},
        {"section":5,"startTime":"15:00","endTime":"15:45"},
        {"section":6,"startTime":"15:55","endTime":"16:40"},
        {"section":7,"startTime":"16:50","endTime":"17:35"},
        {"section":8,"startTime":"17:45","endTime":"18:30"},
        {"section":9,"startTime":"19:00","endTime":"19:45"},
        {"section":10,"startTime":"19:55","endTime":"20:40"},
        {"section":11,"startTime":"20:50","endTime":"21:35"}
    ] : [
        {"section":1,"startTime":"08:00","endTime":"08:45"},
        {"section":2,"startTime":"08:55","endTime":"09:40"},
        {"section":3,"startTime":"10:00","endTime":"10:45"},
        {"section":4,"startTime":"10:55","endTime":"11:40"},
        {"section":5,"startTime":"14:30","endTime":"15:15"},
        {"section":6,"startTime":"15:25","endTime":"16:10"},
        {"section":7,"startTime":"16:20","endTime":"17:05"},
        {"section":8,"startTime":"17:15","endTime":"18:00"},
        {"section":9,"startTime":"19:00","endTime":"19:45"},
        {"section":10,"startTime":"19:55","endTime":"20:40"},
        {"section":11,"startTime":"20:50","endTime":"21:35"}
    ];
})()
