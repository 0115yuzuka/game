class FishingController {
  constructor() {
    this.ws = new WebSocket("ws://localhost:8080");
    this.setupWebSocket();
    this.setupMotionSensor();
  }

  setupWebSocket() {
    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          type: "register",
          clientType: "mobile",
        })
      );
      document.getElementById("status").textContent = "接続完了！";
    };
  }

  setupMotionSensor() {
    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", (event) => {
        const x = event.accelerationIncludingGravity.x;
        const y = event.accelerationIncludingGravity.y;
        const z = event.accelerationIncludingGravity.z;

        this.ws.send(
          JSON.stringify({
            type: "movement",
            x: x,
            y: y,
            z: z,
          })
        );
      });
    } else {
      alert("このデバイスはモーションセンサーをサポートしていません。");
    }
  }
}

window.onload = () => {
  new FishingController();
};
