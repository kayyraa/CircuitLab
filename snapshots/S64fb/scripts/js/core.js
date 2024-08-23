import { Components } from "./components.js";
import { Settings } from "./settings.js";

const Topbar = document.getElementById("topbar");
const Playground = document.getElementById("playground");
const PlayButton = document.getElementById("play");

const GridSize = Settings.GridSize;

let Playing = false;

let Connection = {
    A: null,
    B: null
};

Components.forEach(Component => {
    const ComponentName = Component.Name;
    const NormalState = Component.NormalState;
    const IsTwoState = Component.TwoState;

    const OpenIcon = Component.Icons.Open;
    const ClosedIcon = Component.Icons.Closed;

    const ComponentDisplay = document.createElement("img");
    ComponentDisplay.src = NormalState ? OpenIcon : ClosedIcon;
    ComponentDisplay.style.height = "75%";
    ComponentDisplay.style.aspectRatio = "1 / 1";
    ComponentDisplay.style.cursor = "pointer";
    ComponentDisplay.draggable = false;
    Topbar.appendChild(ComponentDisplay);

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
        Playground.appendChild(FunctionalComponent);

        const FunctionalComponentLabel = document.createElement("span");
        FunctionalComponentLabel.textContent = ComponentName;
        FunctionalComponentLabel.style.position = "relative";
        FunctionalComponentLabel.style.top = "125%";
        FunctionalComponentLabel.style.opacity = "0.25";
        FunctionalComponentLabel.style.pointerEvents = "none";
        FunctionalComponentLabel.draggable = false;
        FunctionalComponent.appendChild(FunctionalComponentLabel);

        const FunctionalComponentIcon = document.createElement("img");
        FunctionalComponentIcon.src = CurrentState ? OpenIcon : ClosedIcon;
        FunctionalComponentIcon.style.height = "75%";
        FunctionalComponentIcon.style.aspectRatio = "1 / 1";
        FunctionalComponentIcon.draggable = false;
        FunctionalComponent.appendChild(FunctionalComponentIcon);

        const InNode = document.createElement("div");
        InNode.style.position = "absolute";
        InNode.style.left = "-20%";
        InNode.style.top = "56%";
        InNode.style.boxSizing = "border-box";
        InNode.style.border = "2px solid rgb(60, 60, 60)";
        InNode.style.borderRadius = "100%";
        InNode.style.width = "16px";
        InNode.style.aspectRatio = "1 / 1";
        InNode.id = "In";
        FunctionalComponent.appendChild(InNode);

        const OutNode = document.createElement("div");
        OutNode.style.position = "absolute";
        OutNode.style.right = "-20%";
        OutNode.style.top = "56%";
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

        document.addEventListener("mouseup", () => {
            if (IsDragging) {
                IsDragging = false;
            }
        });
    });
});

PlayButton.addEventListener("click", () => {
    Playing = !Playing;
    PlayButton.src = Playing ? "../../images/Stop.svg" : "../../images/Play.svg";
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
    HtmlLine.style.left = `${Math.min(X1, X2)}px`;
    HtmlLine.style.top = `${Math.min(Y1, Y2)}px`;
    HtmlLine.style.width = `${Length}px`;
    HtmlLine.style.height = `${thickness}px`;
    HtmlLine.style.backgroundColor = color;
    HtmlLine.style.transform = `rotate(${Angle}deg)`;
    HtmlLine.style.transformOrigin = "0 0";
    document.body.appendChild(HtmlLine);
}

function Loop() {
    if (Connection.A && Connection.B) {
        Connect(Connection.A, Connection.B, "rgba(255, 255, 255, 0.25)", 8);

        Connection.A = null;
        Connection.B = null;
    }

    setTimeout(Loop, 250);
}

Loop()