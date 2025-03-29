class AudioProcessor extends AudioWorkletProcessor {
    process(inputs) {
        if (!inputs[0]?.[0]) return true;

        const input = inputs[0][0];
        const buffer = new Int16Array(input.length);

        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            buffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        this.port.postMessage({
            type: 'audio',
            data: buffer.buffer
        }, [buffer.buffer]);

        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);