import axios from "axios";

class CircuitBreaker {
  private state = {};
  private maxFails = 5;
  private coolDownTimePerSec = 20;

  async callService(api: {
    meethod: string;
    url: string;
    headers?: any;
    data?: any;
  }) {
    if (!this.canRequest(api.url)) {
      return false;
    }
    try {
      const response = await axios(api);
      return response.data;
    } catch (error) {
      return false;
    }
  }

  onSuccess(url: string) {
    this.initState(url);
  }

  onFailed(url: string) {
    this.state[url].failures += 1;
    if (this.state[url].failures >= this.maxFails) {
      this.state[url].circuit = "OPEN";
      this.state[url].nextTryPerSec =
        Date.now() / 1000 + this.coolDownTimePerSec;
    }
  }

  initState(url: string) {
    this.state[url] = {
      failures: 0,
      maxFails: 5,
      coolDownTimePerSec: this.coolDownTimePerSec,
      circuit: "CLOSE",
      nextTryPerSec: 0,
    };
  }

  canRequest(url: string): boolean {
    if (!this.state[url]) {
      this.initState(url);
      return true;
    }

    if (this.state[url].circuit === "CLOSE") {
      return true;
    }

    const now = Date.now() / 1000;
    if (this.state[url].nextTryPerSec < now) {
      this.state[url].circuit = "HALF";
      return true;
    }

    return false;
  }
}

export default CircuitBreaker;
