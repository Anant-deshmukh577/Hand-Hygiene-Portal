import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PORT = process.env.PORT || 5000;

async function killPort() {
  try {
    console.log(`🔍 Checking for processes on port ${PORT}...`);
    
    // Find process using the port
    const { stdout } = await execAsync(`netstat -ano | findstr :${PORT}`);
    
    if (!stdout) {
      console.log(`✅ Port ${PORT} is free!`);
      return;
    }

    // Extract PID from netstat output
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        pids.add(pid);
      }
    });

    // Kill each process
    for (const pid of pids) {
      console.log(`🔪 Killing process ${pid}...`);
      await execAsync(`taskkill /PID ${pid} /F`);
      console.log(`✅ Process ${pid} terminated`);
    }

    console.log(`✅ Port ${PORT} is now free!`);
  } catch (error) {
    if (error.message.includes('No tasks are running')) {
      console.log(`✅ Port ${PORT} is already free!`);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

killPort();
