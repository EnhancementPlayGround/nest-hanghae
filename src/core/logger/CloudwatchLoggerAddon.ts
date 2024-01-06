import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';

type CloudwatchConfig = {
  groupName: string;
  stream_error: string;
  stream_info: string;
};

export type CloudwatchLogPayload = {
  timestamp: string;
  level: string;
  category: string;
  message: any;
  metadata: string;
};

export class CloudwatchLoggerAddon {
  constructor(
    private readonly cloudWatchClient: CloudWatchLogsClient,
    private readonly cloudwatchConfig: CloudwatchConfig,
  ) {}

  public sendInfo(payload: CloudwatchLogPayload) {
    this.sendCloudWatch(
      this.cloudwatchConfig.groupName,
      this.cloudwatchConfig.stream_info,
      payload,
    );
  }

  public sendError(payload: CloudwatchLogPayload) {
    this.sendCloudWatch(
      this.cloudwatchConfig.groupName,
      this.cloudwatchConfig.stream_error,
      payload,
    );
  }

  private sendCloudWatch(
    group: string,
    stream: string,
    payload: CloudwatchLogPayload,
  ) {
    const logEvents = [
      {
        timestamp: new Date().getTime(),
        message: `[${payload.timestamp}] [${payload.level}] [${
          payload.category
        }] ${payload.metadata !== '' ? '- ' + payload.metadata : ''} : ${
          payload.message
        }`,
      },
    ];
    const command = new PutLogEventsCommand({
      logGroupName: group,
      logStreamName: stream,
      logEvents,
    });
    this.cloudWatchClient.send(command);
  }
}
