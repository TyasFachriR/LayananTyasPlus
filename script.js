// Global JavaScript for BookingPro

// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      hamburger.classList.toggle("active")
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        hamburger.classList.remove("active")
      })
    })
  }

  // Animate statistics on homepage
  animateStats()

  // Initialize smooth scrolling
  initSmoothScrolling()

  // Initialize form validations
  initFormValidations()
})

// Animate statistics counters
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number")

  const animateCounter = (element) => {
    const target = Number.parseInt(element.getAttribute("data-target"))
    const increment = target / 100
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = Math.floor(current)
    }, 20)
  }

  // Intersection Observer for animation trigger
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  })

  statNumbers.forEach((stat) => {
    observer.observe(stat)
  })
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Form validation utilities
function initFormValidations() {
  // Email validation
  const emailInputs = document.querySelectorAll('input[type="email"]')
  emailInputs.forEach((input) => {
    input.addEventListener("blur", validateEmail)
  })

  // Phone validation
  const phoneInputs = document.querySelectorAll('input[type="tel"]')
  phoneInputs.forEach((input) => {
    input.addEventListener("blur", validatePhone)
  })

  // Required field validation
  const requiredInputs = document.querySelectorAll("input[required], select[required], textarea[required]")
  requiredInputs.forEach((input) => {
    input.addEventListener("blur", validateRequired)
  })
}

function validateEmail(e) {
  const email = e.target.value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (email && !emailRegex.test(email)) {
    showFieldError(e.target, "Format email tidak valid")
  } else {
    clearFieldError(e.target)
  }
}

function validatePhone(e) {
  const phone = e.target.value
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/

  if (phone && !phoneRegex.test(phone.replace(/\s/g, ""))) {
    showFieldError(e.target, "Format nomor telepon tidak valid")
  } else {
    clearFieldError(e.target)
  }
}

function validateRequired(e) {
  const value = e.target.value.trim()

  if (!value) {
    showFieldError(e.target, "Field ini wajib diisi")
  } else {
    clearFieldError(e.target)
  }
}

function showFieldError(field, message) {
  clearFieldError(field)

  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.style.color = "#dc2626"
  errorDiv.style.fontSize = "0.875rem"
  errorDiv.style.marginTop = "0.25rem"
  errorDiv.textContent = message

  field.style.borderColor = "#dc2626"
  field.parentNode.appendChild(errorDiv)
}

function clearFieldError(field) {
  const existingError = field.parentNode.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }
  field.style.borderColor = "#e5e7eb"
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(timeString) {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Show loading state
function showLoading(button) {
  const originalText = button.textContent
  button.innerHTML = '<span class="loading"></span> Memproses...'
  button.disabled = true
  return originalText
}

function hideLoading(button, originalText) {
  button.innerHTML = originalText
  button.disabled = false
}

// Show alert messages
function showAlert(message, type = "info", container = null) {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type}`
  alertDiv.innerHTML = message

  if (container) {
    container.innerHTML = ""
    container.appendChild(alertDiv)
  } else {
    document.body.insertBefore(alertDiv, document.body.firstChild)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv)
      }
    }, 5000)
  }

  // Scroll to alert
  alertDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })
}

// Local Storage utilities
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error saving to localStorage:", error)
    return false
  }
}

function getFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return defaultValue
  }
}

// Session management
function isLoggedIn() {
  return !!(localStorage.getItem("userData") || sessionStorage.getItem("userData"))
}

function getCurrentUser() {
  const userData = localStorage.getItem("userData") || sessionStorage.getItem("userData")
  return userData ? JSON.parse(userData) : null
}

function logout() {
  localStorage.removeItem("userData")
  sessionStorage.removeItem("userData")
  window.location.href = "login.html"
}

// Generate unique ID
function generateId(prefix = "") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Debounce function for search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Copy to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showAlert("Berhasil disalin ke clipboard!", "success")
    })
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    showAlert("Berhasil disalin ke clipboard!", "success")
  }
}

// Print function
function printElement(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .no-print { display: none; }
                    </style>
                </head>
                <body>
                    ${element.innerHTML}
                </body>
            </html>
        `)
    printWindow.document.close()
    printWindow.print()
  }
}

// Export data to CSV
function exportToCSV(data, filename) {
  const csvContent = "data:text/csv;charset=utf-8," + data
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Initialize tooltips (if needed)
function initTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]")
  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip)
    element.addEventListener("mouseleave", hideTooltip)
  })
}

function showTooltip(e) {
  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = e.target.getAttribute("data-tooltip")
  tooltip.style.position = "absolute"
  tooltip.style.background = "#333"
  tooltip.style.color = "white"
  tooltip.style.padding = "5px 10px"
  tooltip.style.borderRadius = "4px"
  tooltip.style.fontSize = "12px"
  tooltip.style.zIndex = "1000"
  tooltip.style.pointerEvents = "none"

  document.body.appendChild(tooltip)

  const rect = e.target.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px"

  e.target._tooltip = tooltip
}

function hideTooltip(e) {
  if (e.target._tooltip) {
    document.body.removeChild(e.target._tooltip)
    delete e.target._tooltip
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initTooltips()
})

// Handle offline/online status
window.addEventListener("online", () => {
  showAlert("Koneksi internet tersambung kembali", "success")
})

window.addEventListener("offline", () => {
  showAlert("Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi.", "error")
})

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href)
}
