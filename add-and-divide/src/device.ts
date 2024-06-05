import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'device_id';

export const getOrSetDeviceData = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = uuidv4();
    setDeviceId(deviceId);
  }

  return deviceId;
}

export const setDeviceId = (newDeviceId: string) => {
  localStorage.setItem(DEVICE_ID_KEY, newDeviceId);
}
