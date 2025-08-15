import React, { useRef, useState } from 'react'


const App = () => {
    const [topWord, setTopWord] = useState("hold the ")
    const [bottomWord, setBottomWord] = useState("Door man")
    const [meme, setMeme] = useState("http://i.imgflip.com/1bij.jpg")
    const [loading, setLoading] = useState(false)

    const divRef = useRef()

    const handleDownloadImage = async () => {
        // Set canvas size
        const width = 600;
        const height = 400;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw background
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(0, 0, width, height);

        // Draw meme image
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = meme;
        img.onload = () => {
            // Fit image into canvas (contain)
            let imgW = img.width;
            let imgH = img.height;
            let scale = Math.min(width / imgW, height / imgH);
            let drawW = imgW * scale;
            let drawH = imgH * scale;
            let offsetX = (width - drawW) / 2;
            let offsetY = (height - drawH) / 2;
            ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

            // Draw top text
            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.textAlign = 'center';
            ctx.lineWidth = 3;
            ctx.textBaseline = 'top';
            ctx.strokeText(topWord, width / 2, 20, width - 40);
            ctx.fillText(topWord, width / 2, 20, width - 40);

            // Draw bottom text
            ctx.textBaseline = 'bottom';
            ctx.strokeText(bottomWord, width / 2, height - 20, width - 40);
            ctx.fillText(bottomWord, width / 2, height - 20, width - 40);

            // Download
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'my-meme.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    };
    

    async function randomFetch() {
        setLoading(true)
        const res = await fetch("https://api.imgflip.com/get_memes")
        const data = await res.json()
        const memes = data.data.memes;
        const randomIndex = Math.floor(Math.random() * memes.length);
        console.log(memes[randomIndex].url);
        setMeme(memes[randomIndex].url)
        setLoading(false)
    }



    

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-700 via-green-400 to-lime-200 flex flex-col">
      <header className="bg-green-900 bg-opacity-90 text-white text-3xl font-extrabold py-6 shadow-lg">
        <h1 className="text-center uppercase tracking-widest drop-shadow-lg">Meme Generator</h1>
      </header>
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 p-8">
        {/* Form Card */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 w-full max-w-xs flex flex-col items-center border-2 border-green-700">
          <form className="flex flex-col space-y-6 w-full">
            <label className="flex flex-col space-y-2 font-semibold text-green-900">
              <span>Top text</span>
              <input
                type="text"
                className="rounded-lg border-2 border-green-500 focus:border-green-700 focus:ring-2 focus:ring-green-200 px-3 py-2 outline-none transition-all text-lg bg-white bg-opacity-90"
                name="upperText"
                value={topWord}
                onChange={(e) => setTopWord(e.target.value)}
                placeholder="Enter top text..."
              />
            </label>
            <label className="flex flex-col space-y-2 font-semibold text-green-900">
              <span>Bottom text</span>
              <input
                type="text"
                className="rounded-lg border-2 border-green-500 focus:border-green-700 focus:ring-2 focus:ring-green-200 px-3 py-2 outline-none transition-all text-lg bg-white bg-opacity-90"
                name="lowerText"
                value={bottomWord}
                onChange={(e) => setBottomWord(e.target.value)}
                placeholder="Enter bottom text..."
              />
            </label>
          </form>
          <button
            className="mt-8 text-white bg-gradient-to-r from-green-600 to-lime-400 hover:from-lime-400 hover:to-green-600 px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={randomFetch} disabled={loading}
          >
            {loading ? "loading" : "Generate New Meme"} 
          </button>
        </div>

        {/* Meme Card */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-6 flex flex-col items-center w-full max-w-lg border-2 border-green-700">
          <div
            ref={divRef}
            className="meme aspect-[3/2] w-full max-w-lg relative overflow-hidden rounded-xl border-4 border-green-500 shadow-lg"
            style={{ minHeight: 0 }}
          >
            <img
              src={meme}
              alt="Meme"
              className="h-full w-full object-contain rounded-xl"
              crossOrigin="anonymous"
            />
            <span
              className="absolute left-1/2 top-4 -translate-x-1/2 px-2 py-1 text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg  bg-opacity-40 rounded"
              style={{ width: '90%', textAlign: 'center', pointerEvents: 'none', userSelect: 'none' }}
            >
              {topWord}
            </span>
            <span
              className="absolute left-1/2 bottom-4 -translate-x-1/2 px-2 py-1 text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg  bg-opacity-40 rounded"
              style={{ width: '90%', textAlign: 'center', pointerEvents: 'none', userSelect: 'none' }}
            >
              {bottomWord}
            </span>
          </div>
          <button
            className="mt-6 bg-gradient-to-r from-green-700 to-lime-400 hover:from-lime-400 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={handleDownloadImage}
          >
            Download the Meme
          </button>
        </div>
      </main>
      <footer className="text-center text-green-900 py-4 text-sm bg-white bg-opacity-60 mt-auto">
        Made with <span className="text-green-600">❤</span> by Jesubamiro Aduragbemi 
      </footer>
    </div>
  );
}

export default App