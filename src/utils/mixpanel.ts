import mixpanel from "mixpanel-browser";

/**
 * mixpanel이 초기화되었는지 확인하는 함수
 */
export const isMixpanelReady = (): boolean => {
  try {
    return !!mixpanel.get_distinct_id();
  } catch {
    return false;
  }
};

/**
 * 안전한 mixpanel tracking 함수
 * mixpanel이 초기화되지 않은 경우 에러를 발생시키지 않음
 */
export const safeTrack = (
  event: string,
  properties?: Record<string, any>
): void => {
  try {
    if (isMixpanelReady()) {
      mixpanel.track(event, properties);
    } else {
      console.warn(`Mixpanel not ready, skipping event: ${event}`);
    }
  } catch (error) {
    console.error(`Mixpanel tracking error for event ${event}:`, error);
  }
};

/**
 * 안전한 mixpanel identify 함수
 */
export const safeIdentify = (distinctId: string): void => {
  try {
    if (isMixpanelReady()) {
      mixpanel.identify(distinctId);
    }
  } catch (error) {
    console.error("Mixpanel identify error:", error);
  }
};

/**
 * 안전한 mixpanel people.set 함수
 */
export const safeSetPeople = (properties: Record<string, any>): void => {
  try {
    if (isMixpanelReady()) {
      mixpanel.people.set(properties);
    }
  } catch (error) {
    console.error("Mixpanel people.set error:", error);
  }
};
