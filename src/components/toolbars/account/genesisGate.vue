<template>
  <div class="genesis-gate">
    <div class="gate-content">
      <header class="gate-header">
        <div class="gate-icon"></div>
        <h2>Genesis Handshake</h2>
        <p>{{ status }}</p>
      </header>

      <div v-if="loading === true && isReady === false" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <div v-else-if="!verified" class="error-state">
        <div class="error-icon">!</div>
        <p>Integrity Check Failed. Genesis Hash Mismatch.</p>
        <button @click="fetchWasmFromHop" class="retry-button">Retry Verification</button>
      </div>

      <div v-else class="ready-state">
        <p class="welcome-text">Welcome, Peer. Ready to sign the first entry of your Coherence Ledger?</p>
        <div class="action-group">
          <button @click="handleSignClick()" class="sign-button">
            Sign Handshake & Load Experience
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { accountStore } from '@/stores/accountStore.js';
import { aiInterfaceStore } from '@/stores/aiInterface.js';

  const storeAccount = accountStore();
  const storeAI = aiInterfaceStore();
  const emit = defineEmits(['handshake-complete']);

  const status = ref('Connecting to HOP...');
  const loading = ref(true);
  const verified = ref(false);
  const GENESIS_WASM_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // Hardcoded hash of hop_crypto.wasm
  let isReady = ref(false)

  onMounted(async () => {
    const existingKey = localStorage.getItem('hop_sovereign_pubkey');
    console.log('existingKey', existingKey, '')
    if (existingKey) {
      // 1. WE HAVE AN IDENTITY
      console.log("Welcome back, Peer:", existingKey);
      isReady.value = true;   // Clear the spinner immediately
      loading.value = false;
      status.value = "Identity Restored.";
      
      // We still request WASM in the background so we can SIGN later
      fetchWasmFromHop();
      // close the self ver. start
      storeAccount.accountMenu = 'account'
      storeAccount.accountStatus = !storeAccount.accountStatus
      storeAccount.peerauth = true
      storeAccount.orbitLive = true
      // main chat interface  or new (TODO)
      storeAI.startChat = false
    } else {
      // 2. FRESH START
      status.value = "New Peer Detected. Initializing Genesis...";
      fetchWasmFromHop(); // This keeps the spinner active until WASM arrives
    }
  });

  /* computed */
  const accountBoxStatus = computed(() => {
    return storeAccount.accountStatus
  })

  const computeHash = async (buffer) => {
    // Ensure buffer is an ArrayBuffer or ArrayBufferView
    let dataToHash = buffer;
    if (buffer instanceof Uint8Array) {
      dataToHash = buffer.buffer;
    } else if (!(buffer instanceof ArrayBuffer)) {
      // If it's a regular array or something else, try to convert it
      try {
        dataToHash = new Uint8Array(buffer).buffer;
      } catch (e) {
        console.error("Failed to convert buffer for hashing:", e);
        throw new Error("Invalid buffer format for hashing");
      }
    }
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataToHash);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const fetchWasmFromHop = async () => {
    loading.value = true;
    status.value = 'Requesting Crypto WASM from HOP...';
    
    // In the HOP architecture, we request the WASM via the message bus
    storeAccount.sendMessageHOP({
      type: 'hop-auth',
      action: 'request-crypto-wasm',
      reftype: 'genesis-handshake',
      task: 'genesis-handshake',
      data: {}
    });

  };

  // We need to listen for the WASM buffer response in the store
  // For this component, we'll watch the store for the incoming WASM data
  watch(() => storeAccount.incomingWasmBuffer, async (buffer) => {

    if (buffer) {
      console.log("Received WASM buffer type:", typeof buffer, buffer.constructor.name);
      status.value = 'Verifying WASM Integrity...';
      try {
        const actualHash = await computeHash(buffer);
        console.log("Actual WASM Hash:", actualHash);
        console.log("Expected WASM Hash:", GENESIS_WASM_HASH);
        if (actualHash === GENESIS_WASM_HASH) {
          console.log('match cry')
          verified.value = true;
          status.value = "Sovereign Crypto Verified.";
        } else {
          verified.value = false;
          status.value = "Integrity Failure: WASM Tampered.";
        }
      } catch (err) {
        console.error("Hashing error:", err);
        status.value = "Error during integrity check.";
      }
      loading.value = false;
    }
  });

  const handleSignClick = async () => {
    // persistSovereign()
  };

  const persistSovereign = () => {
    console.log('Anchoring Sovereign Identity...');
    
    // Generate the pair from the initialized WASM
    const pair = new SovereignKeypair();
    const pubKey = pair.get_public_key(); 

    // Convert Uint8Array to Hex string for LocalStorage
    const pubKeyHex = Array.from(pubKey)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // ANCHOR: Now your Sovereign Tab will find this on refresh!
    localStorage.setItem('hop_sovereign_pubkey', pubKeyHex);
    
    // NOTE: We will handle private key encryption in the next 'Stitch'
    localStorage.setItem('hop_sovereign_privkey', 'REGEN_REQUIRED_FOR_SESSIONS'); 

    console.log("✅ Identity Anchored:", pubKeyHex);
    
    // Notify the UI to refresh the Sovereign status
    this.keyExists = true;
  }

</script>

<style scoped>
.genesis-gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  margin: 2rem auto;
}

.gate-header h2 {
  margin: 0.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
}

.gate-header p {
  color: #64748b;
  font-size: 0.9rem;
}

.loading-spinner {
  margin: 2rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #ef4444;
  margin: 1.5rem 0;
}

.error-icon {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.ready-state {
  margin-top: 1.5rem;
}

.welcome-text {
  color: #334155;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.sign-button {
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sign-button:hover {
  background-color: #1d4ed8;
}

.retry-button {
  background-color: #94a3b8;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
