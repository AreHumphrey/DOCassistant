import JSZip from 'jszip'
import { useState } from 'react'
import EditorWindow from './Editor'

const MainWindow = ({ images, needsave }) => {
  const [selectedDcmUrl, setSelectedDcmUrl] = useState(null)

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const handleImageClick = (dcmUrl, index) => {
    setSelectedImageIndex(index);
    console.log(dcmUrl)
    if (Array.isArray(dcmUrl) && dcmUrl.every(item => item.startsWith("blob:"))) {
      setSelectedDcmUrl(dcmUrl)
    }
    else if (dcmUrl.startsWith("blob:")) {
      handleArchive(dcmUrl)
    }
    else if (dcmUrl.endsWith(".dcm")) {
      setSelectedDcmUrl([dcmUrl])
    }
    else if (dcmUrl.endsWith(".zip")) {
      handleArchive(dcmUrl)
    }
    else {
      console.error("Этот тип файлов не поддерживается")
    }
  }

  const handleArchive = async (archive) => {
    try {
      const response = await fetch(archive)
      const data = await response.arrayBuffer()
      const zip = await JSZip.loadAsync(data)

      const dicomFiles = []
      const promises = []

      zip.forEach((relativePath, file) => {
        if (file.name.endsWith('.dcm')) {
          const promise = file.async('blob').then((blob) => {
            const url = URL.createObjectURL(blob)
            dicomFiles.push(url)
          })
          promises.push(promise)
        }
      })

      await Promise.all(promises)

      if (dicomFiles.length === 0) {
        console.error("В архиве нет DICOM файлов")
        return
      }

      setSelectedDcmUrl(dicomFiles)
      console.log(dicomFiles)

    } catch (error) {
      console.error('Ошибка при обработке архива:', error)
    }
  }

  return (
    <div className='flex flex-row w-full h-full'>
      {selectedDcmUrl && (
        <EditorWindow key={selectedDcmUrl} imagePath={selectedDcmUrl} needsave={needsave} />
      )}
      <div 
      className='fixed right-0 mt-7 
      bg-gray-my-1 w-3/12 h-full 
      flex flex-col content-center gap-6 p-12
      overflow-y-auto
      rounded-3xl'>
        {images.map((image, index) => (
          <label key={index} className="relative inline-block cursor-pointer group">
            {/* Флажок (радио-баттон) */}
            <input
              type="radio"
              name="selectedImage"
              value={index}
              checked={selectedImageIndex === index}
              onChange={() => handleImageClick(image.dcm_url, index)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {/* Изображение */}
            <img
              src={image.png_url}
              alt={`Image ${index}`}
              className="w-64 h-36 object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />

            {/* Внешний серый круг */}
            <div className="absolute bottom-12 left-20 w-full h-full rounded-full flex items-center justify-center">
              {/* Внутренний круг с галкой */}
              {selectedImageIndex === index ? (
                <div className="size-7 rounded-full bg-gray-my-1 flex items-center justify-center">
                  {/* Галочка */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              ) : (
                <div className="size-7 rounded-full bg-gray-my-1" />
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

export default MainWindow