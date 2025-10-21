#!/usr/bin/env node
/*
  Copies an APK to web/downloads/app-release.apk and optionally commits & pushes.
  Usage:
    node scripts/publish-apk.js --src "android/app/build/outputs/apk/release/app-release.apk" --dest "web/downloads/app-release.apk" --commit
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

function parseArgs(){
  const args = process.argv.slice(2);
  const out = { src: undefined, dest: undefined, commit: false };
  for(let i=0;i<args.length;i++){
    const a = args[i];
    if(a === '--src') out.src = args[++i];
    else if(a === '--dest') out.dest = args[++i];
    else if(a === '--commit') out.commit = true;
  }
  if(!out.src) out.src = path.join('android','app','build','outputs','apk','release','app-release.apk');
  if(!out.dest) out.dest = path.join('web','downloads','app-release.apk');
  return out;
}

function sha256(file){
  const h = crypto.createHash('sha256');
  h.update(fs.readFileSync(file));
  return h.digest('hex');
}

function main(){
  const { src, dest, commit } = parseArgs();
  if(!fs.existsSync(src)){
    console.error(`Source APK not found at: ${src}`);
    process.exit(1);
  }
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  const stats = fs.statSync(dest);
  const hash = sha256(dest);
  console.log(`APK copied to ${dest}`);
  console.log(`Size: ${(stats.size/1024/1024).toFixed(2)} MB, SHA-256: ${hash.substring(0,12)}…`);

  if(commit){
    try{
      execSync('git add web', { stdio: 'inherit' });
      execSync(`git commit -m "chore(apk): update APK (${(stats.size/1024/1024).toFixed(2)} MB, sha256 ${hash.substring(0,12)})"`, { stdio: 'inherit' });
    }catch(e){
      console.log('Nothing to commit or commit failed. Continuing.');
    }
    try{
      execSync('git push', { stdio: 'inherit' });
    }catch(e){
      console.error('Push failed. Please push manually.');
    }
  }
}

main();
