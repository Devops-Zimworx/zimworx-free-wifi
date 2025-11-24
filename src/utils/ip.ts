// I try both IPv4 and IPv6 endpoints so at least one of them works in the field.
const IP_ENDPOINTS = [
  'https://api.ipify.org?format=json',
  'https://api64.ipify.org?format=json',
];

type IpifyResponse = {
  ip?: string;
};

type TimeoutHandle = ReturnType<typeof setTimeout> | null;

function createAbortController(timeoutMs: number) {
  if (typeof AbortController === 'undefined') {
    return { controller: null, timeoutId: null as TimeoutHandle };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

// I resolve the client IP best-effort because some browsers or networks will block these requests.
export async function fetchClientIp(timeoutMs: number = 2000): Promise<string | null> {
  for (const endpoint of IP_ENDPOINTS) {
    const { controller, timeoutId } = createAbortController(timeoutMs);

    try {
      const response = await fetch(endpoint, {
        signal: controller?.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`IP lookup failed with status ${response.status}`);
      }

      const data = (await response.json()) as IpifyResponse;

      if (data?.ip) {
        return data.ip;
      }
    } catch (error) {
      console.warn('Unable to resolve client IP via', endpoint, error);
    } finally {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    }
  }

  return null;
}

