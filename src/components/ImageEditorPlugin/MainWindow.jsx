import JSZip from 'jszip'
import { useState } from 'react'
import EditorWindow from './Editor'

const MainWindow = ({ images, needsave }) => {
  const [selectedDcmUrl, setSelectedDcmUrl] = useState(null)

  const handleImageClick = (dcmUrl) => {
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
    <div>
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.png_url}
            alt={`Image ${index}`}
            style={{ width: '150px', marginRight: '10px', cursor: 'pointer' }}
            onClick={() => handleImageClick(image.dcm_url)}
          />
        ))}
      </div>

      {selectedDcmUrl && (
        <EditorWindow key={selectedDcmUrl} imagePath={selectedDcmUrl} needsave={needsave} />
      )}
    </div>
  )
}

export default MainWindow