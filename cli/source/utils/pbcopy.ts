export const copy = (command: string) =>{
  var proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(command);
  proc.stdin.end();
}