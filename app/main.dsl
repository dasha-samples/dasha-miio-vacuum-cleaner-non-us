context
{
    input phone: string;
}

external function startCleaner():boolean;
external function stopCleaner():boolean;
external function getBattery():number;

start node root
{
    do
    {
        #connectSafe($phone);
        wait *;
    }
}

digression start_cleaning
{
    conditions { on #messageHasIntent("start_cleaning"); }
    do
    {
        #sayText("Хорошо. Это место нуждается в уборке.");
        external startCleaner();
        return;
    }
}
digression stop_cleaning
{
    conditions { on #messageHasIntent("stop_cleaning"); }
    do
    {
        #sayText("Понятно, возвращаюсь на станцию");
        external stopCleaner();
        return;
    }
}

digression get_battery
{
    conditions { on #messageHasIntent("battery_level"); }
    do
    {
        var bl = external getBattery();
        #say("battery_level",
        {
            level: bl
        }
        );
        return;
    }
}

digression hangup
{
    conditions
    {
        on true tags: onclosed;
    }
    do
    {
        exit;
    }
}
