import {isIP} from 'node:net';

// Enable proxy trust only when the backend is reachable solely through your reverse proxy.
export function clientIp(req,trustProxy=false){
 const direct=req.socket.remoteAddress||'unknown';
 const forwarded=req.headers['x-forwarded-for'];
 if(trustProxy&&typeof forwarded==='string'){
  // The nearest proxy appends the actual connecting client, after any untrusted prefix.
  const candidate=forwarded.split(',').at(-1).trim();
  if(isIP(candidate))return candidate.replace(/^::ffff:/i,'');
 }
 return direct.replace(/^::ffff:/i,'');
}
