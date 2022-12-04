GREG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
SOL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'Sol', 'July', 'August', 'September', 'October', 'November', 'December'];
GREG_MONTH_DUR_NL = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
GREG_MONTH_DUR_L = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
GREG_MONTH_DUR_NL_S = []; GREG_MONTH_DUR_L_S = [];
let el_greg_day = document.getElementById("gregorian_day");
let el_greg_month = document.getElementById("gregorian_month");
let el_greg_year = document.getElementById("gregorian_year");
let el_greg_span = document.getElementById("gregorian_span");
let el_sol_day = document.getElementById("sol_day");
let el_sol_month = document.getElementById("sol_month");
let el_sol_year = document.getElementById("sol_year");
let el_sol_span = document.getElementById("sol_span");

{
    let x = 0;
    for (i=0;i<12;++i) {
        x += GREG_MONTH_DUR_L[i];
        GREG_MONTH_DUR_L_S.push(x);
    }
    x = 0;
    for (i=0;i<12;++i) {
        x += GREG_MONTH_DUR_NL[i];
        GREG_MONTH_DUR_NL_S.push(x);
    }
}

function is_leap(year) {
    if (year%100==0) {
        return year%400==0;
    }
    return year%4==0;
}

function sol_span(day, month, year){
    if ((!Number.isInteger(day))||(!Number.isInteger(year))) {
        if ((Number.isInteger(month))&&(month<14)&&(month>0)) {return [false, "Wrong date, all values must be integers; "+day+". "+SOL_MONTHS[month-1]+" "+year]}
        else {return [false, "Wrong date, all values must be integers; "+day+"."+month+"."+year]}
    }
    if ((month<0)||(month>13)) {
        return [false, "Wrong date, months are numbered between 1 and 13; "+day+"."+month+"."+year]
    }
    if (month<13) {
        if ((day<1)||(day>28)) return [false, "Wrong date, months 1 to 12 have 28 days; "+day+". "+SOL_MONTHS[month-1]+" "+year]
    }
    if (month==13) {
        if (is_leap(year)) {
            if ((day<1)||(day>30)) return [false, "Wrong date, December has 30 days during a leap year; "+day+". "+SOL_MONTHS[month-1]+" "+year]
        } else {
            if ((day<1)||(day>29)) return [false, "Wrong date, December has 29 days except if during a leap year; "+day+". "+SOL_MONTHS[month-1]+" "+year]
        }
    }
    return [true, day+". "+SOL_MONTHS[month-1]+" "+year]
}

function greg_span(day, month, year){
    if ((!Number.isInteger(day))||(!Number.isInteger(year))) {
        if ((Number.isInteger(month))&&(month<13)&&(month>0)) {return [false, "Wrong date, all values must be integers; "+day+". "+GREG_MONTHS[month-1]+" "+year]}
        else {return [false, "Wrong date, all values must be integers; "+day+"."+month+"."+year]}
    }
    if ((month<0)||(month>12)) {
        return [false, "Wrong date, months are numbered between 1 and 12; "+day+"."+month+"."+year]
    }
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        if ((day<1)||(day>31)) return [false, "Wrong date, "+GREG_MONTHS[month-1]+" has 31 days; "+day+". "+GREG_MONTHS[month-1]+" "+year]
    } else if (month==2) {
        if (is_leap(year)) {
            if ((day<1)||(day>29)) return [false, "Wrong date, February has 29 days during a leap year; "+day+". "+GREG_MONTHS[month-1]+" "+year]
        } else {
            if ((day<1)||(day>28)) return [false, "Wrong date, February has 28 days except if during a leap year; "+day+". "+GREG_MONTHS[month-1]+" "+year]
        }
    } else {
        if ((day<1)||(day>30)) return [false, "Wrong date, "+GREG_MONTHS[month-1]+" has 30 days; "+day+". "+GREG_MONTHS[month-1]+" "+year]
    }
    return [true, day+". "+GREG_MONTHS[month-1]+" "+year]
}

function sol_cday(day, month, year) {
    return (month-1)*28+day;
}

function sol_date(cday) {
    if (cday>28*12) {
        day = cday-28*12;
        month = 13;
    } else {
        day = cday%28;
        if (day==0) day=28;
        month = Math.floor(cday/28)+1;
    }
    return [day, month];
}


function greg_cday(day, month, year) {
    let arr = [];
    if (is_leap(year)) arr = GREG_MONTH_DUR_L_S;
    else arr=GREG_MONTH_DUR_NL_S;
    let r = 0;
    if (month!=1) r += arr[month-2];
    return r+day;
}

function greg_date(cday, if_leap) {
    let arr=[];
    if (if_leap) arr = GREG_MONTH_DUR_L_S;
    else arr = GREG_MONTH_DUR_NL_S;
    // if (cday==arr[11]) return [31, 12];
    if (cday<=31) return [cday, 1];
    for (i=1; i<=12; i++) {
        if (cday<=arr[i]) {
            return [cday-arr[i-1], i+1];
        }
    }
}

function greg_to_sol(day, month, year) {
    let r = sol_date(greg_cday(day, month, year)); r.push(year);
    return r;
}

function sol_to_greg(day, month, year) {
    let r = greg_date(sol_cday(day, month, year), is_leap(year)); r.push(year);
    return r;
}

function c_greg_to_sol() {
    greg_day = Number(el_greg_day.value);
    greg_month = Number(el_greg_month.value);
    greg_year = Number(el_greg_year.value);
    let span_response = greg_span(greg_day, greg_month, greg_year);
    el_greg_span.innerHTML = span_response[1];
    if (!span_response[0]) {
        el_greg_span.style.color = "red";
        return;
    } else {
        el_greg_span.style.color = "black";
    }
    let sol_resp = greg_to_sol(greg_day, greg_month, greg_year);
    el_sol_day.value = sol_resp[0];
    el_sol_month.value = sol_resp[1];
    el_sol_year.value = sol_resp[2];
    el_sol_span.innerHTML = sol_span(sol_resp[0], sol_resp[1], sol_resp[2])[1];
}

function c_sol_to_greg() {
    sol_day = Number(el_sol_day.value);
    sol_month = Number(el_sol_month.value);
    sol_year = Number(el_sol_year.value);
    let span_response = sol_span(sol_day, sol_month, sol_year);
    el_sol_span.innerHTML = span_response[1];
    if (!span_response[0]) {
        el_sol_span.style.color = "red";
        return;
    } else {
        el_sol_span.style.color = "black";
    }
    let greg_resp = sol_to_greg(sol_day, sol_month, sol_year);
    el_greg_day.value = greg_resp[0];
    el_greg_month.value = greg_resp[1];
    el_greg_year.value = greg_resp[2];
    el_greg_span.innerHTML = greg_span(greg_resp[0], greg_resp[1], greg_resp[2])[1];
}

el_greg_day.addEventListener("change", c_greg_to_sol);
el_greg_month.addEventListener("change", c_greg_to_sol);
el_greg_year.addEventListener("change", c_greg_to_sol);
el_sol_day.addEventListener("change", c_sol_to_greg);
el_sol_month.addEventListener("change", c_sol_to_greg);
el_sol_year.addEventListener("change", c_sol_to_greg);