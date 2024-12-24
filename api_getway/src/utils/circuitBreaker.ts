import axios from "axios";

class CircuitBreaker {
  private state: any = {};
  private maxFails = 5;
  private coolDownTimePerSec = 20;

  private onSuccess(url: string) {
    this.initState(url);
  }

  private onFailed(url: string) {
    this.state[url].failures += 1;
    if (this.state[url].failures >= this.maxFails) {
      this.state[url].circuit = "OPEN";
      this.state[url].nextTryPerSec =
        Date.now() / 1000 + this.coolDownTimePerSec;
    }
  }

  private initState(url: string) {
    this.state[url] = {
      failures: 0,
      maxFails: 5,
      coolDownTimePerSec: this.coolDownTimePerSec,
      circuit: "CLOSE",
      nextTryPerSec: 0,
    };
  }

  private canRequest(url: string): boolean {
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

  public async callService(api: {
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
      this.onSuccess(api.url);
      return response.data;
    } catch (error: any) {
      this.onFailed(api.url);
      return { status: error.status, data: error.response.data };
    }
  }
}

export default CircuitBreaker;
