import { Components } from "./components.js";
import { Settings } from "./settings.js";

const Topbar = document.getElementById("topbar");
const Playground = document.getElementById("playground");

const GridSize = Settings.GridSize;

let Connection = {
    A: null,
    B: null
};

Components.forEach(Component => {
    const ComponentName = Component.Name;
    const NormalState = Component.NormalState;
    const IsTwoState = Component.TwoState;
    const ComponentType = Component.Type;

    const OpenIcon = Component.Icons.Open;
    const ClosedIcon = Component.Icons.Closed;
    const DefaultIcon = Component.Icons.Default;

    const ComponentDisplay = document.createElement("img");
    ComponentDisplay.src = IsTwoState
    ? (NormalState ? OpenIcon : ClosedIcon)
    : (DefaultIcon ? DefaultIcon : "");
    ComponentDisplay.style.height = "50%";
    ComponentDisplay.style.aspectRatio = "1 / 1";
    ComponentDisplay.style.cursor = "pointer";
    ComponentDisplay.style.marginLeft = "32px";
    ComponentDisplay.style.transition = "transform 0.25s ease";
    ComponentDisplay.draggable = false;
    Topbar.appendChild(ComponentDisplay);

    ComponentDisplay.addEventListener("mouseenter", function() {
        this.style.transform = "scale(1.25)";
    });
    ComponentDisplay.addEventListener("mouseleave", function() {
        this.style.transform = "scale(1)";
    });

    ComponentDisplay.addEventListener("click", function() {
        let CurrentState = NormalState;

        const FunctionalComponent = document.createElement("div");
        FunctionalComponent.style.position = "absolute";
        FunctionalComponent.style.display = "flex";
        FunctionalComponent.style.flexDirection = "column";
        FunctionalComponent.style.width = "64px";
        FunctionalComponent.style.aspectRatio = "1 / 1";
        FunctionalComponent.style.justifyContent = "center";
        FunctionalComponent.style.alignItems = "center";
        FunctionalComponent.style.margin = "32px";
        FunctionalComponent.style.cursor = "pointer";
        FunctionalComponent.draggable = false;

        FunctionalComponent.dataset.Type = Component.Type;
        FunctionalComponent.dataset.Voltage = Component.Voltage ? Component.Voltage : "";
        FunctionalComponent.dataset.Current = Component.Current? Component.Current : "";
        Playground.appendChild(FunctionalComponent);

        const FunctionalComponentLabel = document.createElement("span");
        FunctionalComponentLabel.textContent = ComponentName;
        FunctionalComponentLabel.style.position = "relative";
        FunctionalComponentLabel.style.textAlign = "center";
        FunctionalComponentLabel.style.top = "150%";
        FunctionalComponentLabel.style.opacity = "0.25";
        FunctionalComponentLabel.style.pointerEvents = "none";
        FunctionalComponentLabel.draggable = false;
        FunctionalComponent.appendChild(FunctionalComponentLabel);

        const FunctionalComponentIcon = document.createElement("img");
        FunctionalComponentIcon.src = IsTwoState
        ? (NormalState ? OpenIcon : ClosedIcon)
        : (DefaultIcon ? DefaultIcon : "");
        FunctionalComponentIcon.style.height = "75%";
        FunctionalComponentIcon.style.aspectRatio = "1 / 1";
        FunctionalComponentIcon.draggable = false;
        FunctionalComponent.appendChild(FunctionalComponentIcon);

        const InNode = document.createElement("div");
        InNode.style.position = "absolute";
        InNode.style.left = "-20px";
        InNode.style.top = "50px";
        InNode.style.boxSizing = "border-box";
        InNode.style.border = "2px solid rgb(60, 60, 60)";
        InNode.style.borderRadius = "100%";
        InNode.style.width = "16px";
        InNode.style.aspectRatio = "1 / 1";
        InNode.id = "In";
        FunctionalComponent.appendChild(InNode);

        const OutNode = document.createElement("div");
        OutNode.style.position = "absolute";
        OutNode.style.right = "-20px";
        OutNode.style.top = "50px";
        OutNode.style.boxSizing = "border-box";
        OutNode.style.border = "2px solid rgb(60, 60, 60)";
        OutNode.style.borderRadius = "100%";
        OutNode.style.width = "16px";
        OutNode.style.aspectRatio = "1 / 1";
        OutNode.id = "Out";
        FunctionalComponent.appendChild(OutNode);

        let IsDragging = false;
        let OffsetX = 0;
        let OffsetY = 0;

        FunctionalComponent.addEventListener("mousedown", (Event) => {
            IsDragging = true;
            OffsetX = Event.clientX - FunctionalComponent.getBoundingClientRect().left;
            OffsetY = Event.clientY - FunctionalComponent.getBoundingClientRect().top;

            if (IsTwoState) {
                CurrentState = !CurrentState;
                FunctionalComponentIcon.src = CurrentState ? OpenIcon : ClosedIcon;
            }
        });

        document.addEventListener("mousemove", (Event) => {
            if (IsDragging) {
                const X = Event.clientX - OffsetX;
                const Y = Event.clientY - OffsetY;
                
                const SnappedLeft = Math.round(parseInt(X) / GridSize) * GridSize;
                const SnappedTop = Math.round(parseInt(Y) / GridSize) * GridSize;

                FunctionalComponent.style.left = `${SnappedLeft}px`;
                FunctionalComponent.style.top = `${SnappedTop}px`;
            }
        });

        document.addEventListener("keypress", (Event) => {
            if (Event.key === "r") {
                const CurrentTransform = FunctionalComponent.style.transform;
                const Match = CurrentTransform.match(/rotate\((\d+)deg\)/);
                const CurrentRotation = Match ? parseFloat(Match[1]) : 0;
                const NewRotation = CurrentRotation + 90;
                FunctionalComponent.style.transform = `rotate(${NewRotation}deg)`;
            }
        });

        document.addEventListener("mouseup", () => {
            if (IsDragging) {
                IsDragging = false;
            }
        });
    });
});

document.addEventListener("click", (Event) => {
    const IsConnective = (Event.target.id == "In" || Event.target.id == "Out");

    if (IsConnective) {
        if (Connection.A == null) {
            Connection.A = Event.target;
        } else if (Connection.A != null) {
            Connection.B = Event.target;
        }
    }
});

function GetOffset(el) {
    var Rect = el.getBoundingClientRect();
    return {
        Left: Rect.left + window.pageXOffset,
        Top: Rect.top + window.pageYOffset,
        Width: Rect.width || el.offsetWidth,
        Height: Rect.height || el.offsetHeight
    };
}

function Connect(div1, div2, color, thickness) {
    var Off1 = GetOffset(div1);
    var Off2 = GetOffset(div2);
    var X1 = Off1.Left + (Off1.Width / 2);
    var Y1 = Off1.Top + (Off1.Height / 2);
    var X2 = Off2.Left + (Off2.Width / 2);
    var Y2 = Off2.Top + (Off2.Height / 2);

    var Length = Math.sqrt(((X2 - X1) ** 2) + ((Y2 - Y1) ** 2));
    var Angle = Math.atan2(Y2 - Y1, X2 - X1) * (180 / Math.PI);

    var HtmlLine = document.createElement("div");
    HtmlLine.style.position = "absolute";
    HtmlLine.style.left = `${X1}px`;
    HtmlLine.style.top = `${Y1}px`;
    HtmlLine.style.width = `${Length}px`;
    HtmlLine.style.height = `${thickness}px`;
    HtmlLine.style.backgroundColor = color;
    HtmlLine.style.transform = `rotate(${Angle}deg)`;
    HtmlLine.style.transformOrigin = "0 0";
    HtmlLine.style.borderRadius = "64px";
    HtmlLine.id = "Cable";

    HtmlLine.dataset.Voltage = 0;
    HtmlLine.dataset.Current = 0;

    document.body.appendChild(HtmlLine);

    const Label = document.createElement("span");
    Label.innerHTML = `${parseFloat(HtmlLine.dataset.Current).toFixed(1)}A ${parseFloat(HtmlLine.dataset.Voltage).toFixed(1)}V`;
    Label.style.position = "absolute";
    Label.style.left = "50%";
    Label.style.top = "-40px";
    Label.style.transform = `rotate(${-Angle}deg)`;
    Label.style.transformOrigin = "center";
    Label.style.fontSize = "24px";
    Label.style.textAlign = "center";

    HtmlLine.appendChild(Label);

    return HtmlLine;
}

function UpdateCable({A, B, Cable}) {
    var Off1 = GetOffset(A);
    var Off2 = GetOffset(B);
    var X1 = Off1.Left + (Off1.Width / 2);
    var Y1 = Off1.Top + (Off1.Height / 2);
    var X2 = Off2.Left + (Off2.Width / 2);
    var Y2 = Off2.Top + (Off2.Height / 2);

    var Length = Math.sqrt(((X2 - X1) ** 2) + ((Y2 - Y1) ** 2));
    var Angle = Math.atan2(Y2 - Y1, X2 - X1) * (180 / Math.PI);

    Cable.style.left = `${X1}px`;
    Cable.style.top = `${Y1}px`;
    Cable.style.width = `${Length}px`;
    Cable.style.transform = `rotate(${Angle}deg)`;
    Cable.style.transformOrigin = "0 0";

    Array.from(Cable.getElementsByTagName("span")).forEach(Label => {
        const Current = parseFloat(Cable.dataset.Current).toFixed(1);
        const Voltage = parseFloat(Cable.dataset.Voltage).toFixed(1);

        Label.innerHTML = `${Current}A ${Voltage}V`;
    });
}

let Cables = [];
let Electrons = [];

function Loop() {
    if (Connection.A && Connection.B) {
        const ConnectionCable = Connect(Connection.A, Connection.B, "rgba(255, 255, 255, 0.25)", 8);

        const ExistingElectron = Electrons.find(e => e.Cable === ConnectionCable);
        if (!ExistingElectron) {
            const Voltage = parseFloat(parseFloat(ConnectionCable.dataset.Voltage).toFixed(1));
            const Current = parseFloat(parseFloat(ConnectionCable.dataset.Current).toFixed(1));

            if (Voltage > 0 && Current > 0) {
                const Electron = document.createElement("div");
                Electron.style.position = "absolute";
                Electron.style.width = "10px";
                Electron.style.height = "10px";
                Electron.style.backgroundColor = "yellow";
                Electron.style.borderRadius = "50%";
                Electron.id = "Electron";

                Electron.style.left = "0px";
                Electron.style.top = "0px";

                ConnectionCable.appendChild(Electron);

                Electrons.push({ Cable: ConnectionCable, Electron: Electron, Progress: 0 });
            }
        }

        Cables.push({ A: Connection.A, B: Connection.B, Cable: ConnectionCable });

        Connection.A = null;
        Connection.B = null;
    }

    Cables.forEach(CableObject => {
        const A = CableObject.A;
        const B = CableObject.B;
        const Cable = CableObject.Cable;

        Cable.dataset.Voltage = 
            A.offsetParent.dataset.Type === "VoltageSource" 
            ? parseFloat(A.offsetParent.dataset.Voltage).toFixed(1) 
            : B.offsetParent.dataset.Type === "VoltageSource" 
            ? parseFloat(B.offsetParent.dataset.Voltage).toFixed(1) 
            : Cable.dataset.Voltage;

        Cable.dataset.Current = 
            A.offsetParent.dataset.Type === "VoltageSource" 
            ? parseFloat(A.offsetParent.dataset.Current).toFixed(1) 
            : B.offsetParent.dataset.Type === "VoltageSource" 
            ? parseFloat(B.offsetParent.dataset.Current).toFixed(1) 
            : Cable.dataset.Current;

        UpdateCable({ A, B, Cable });
    });

    Electrons.forEach(ElectronObject => {
        const Cable = ElectronObject.Cable;
        const Electron = ElectronObject.Electron;

        const Voltage = parseFloat(parseFloat(Cable.dataset.Voltage).toFixed(1));
        const Current = parseFloat(parseFloat(Cable.dataset.Current).toFixed(1));

        if (Voltage >= 0.5 && Current >= 1) {
            let Progress = ElectronObject.Progress;
            let Direction = ElectronObject.Direction || 3;
            
            const CableLength = Cable.offsetWidth;
            
            Progress += Direction;
            
            if (Progress >= CableLength || Progress <= 0) {
                Direction *= -1;
            }
        
            Electron.style.left = `${Progress}px`;
        
            ElectronObject.Progress = Progress;
            ElectronObject.Direction = Direction;
        }
    });

    requestAnimationFrame(Loop);
}

Loop();