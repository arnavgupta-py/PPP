import numpy as np
from scipy.io.wavfile import write
import os

# Sampling rate
fs = 44100  # 44.1 kHz

# Duration of each note in seconds
duration = 1.0

# Frequencies of Indian classical notes (approximate)
notes_freq = {
    'Sa': 240,
    'Re': 270,
    'Ga': 300,
    'Ma': 320,
    'Pa': 360,
    'Dha': 400,
    'Ni': 450,
    'Sa_hi': 480
}

# Output folder
output_folder = "notes"
os.makedirs(output_folder, exist_ok=True)

def generate_sine_wave(frequency, duration, fs):
    t = np.linspace(0, duration, int(fs * duration), endpoint=False)
    wave = 0.5 * np.sin(2 * np.pi * frequency * t)  # 0.5 to reduce volume
    return wave

# Generate and save each note
for note, freq in notes_freq.items():
    print(f"Generating {note}.wav ({freq} Hz)")
    wave = generate_sine_wave(freq, duration, fs)
    
    # Convert to 16-bit PCM
    wave_int16 = np.int16(wave * 32767)
    
    # Save as .wav file
    write(os.path.join(output_folder, f"{note}.wav"), fs, wave_int16)

print("All notes generated successfully in the 'notes' folder.")
