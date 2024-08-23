export const Components = [
    {
        Name: "Switch",
        NormalState: false,
        TwoState: true,
        Type: "Switch",

        Icons: {
            Open: "../../images/switch/Open.svg",
            Closed: "../../images/switch/Closed.svg"
        }
    },
    {
        Name: "Voltage Source",
        Voltage: 5,
        Current: 1,
        NormalState: true,
        TwoState: false,
        Type: "VoltageSource",

        Icons: {
            Default: "../../images/voltage-source/VoltageSource.svg"
        }
    },
    {
        Name: "Diode",
        NormalState: true,
        TwoState: false,
        Type: "Diode",

        Icons: {
            Default: "../../images/diode/Diode.svg"
        }
    },
    {
        Name: "LED",
        NormalState: true,
        TwoState: false,
        Type: "Diode",

        Icons: {
            Default: "../../images/led/LED.svg"
        }
    }
];