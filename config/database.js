if(process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURL: 'mongodb+srv://dan:12345@vidprod-o2ut2.mongodb.net/test?retryWrites=true&w=majority'
  }
}else {
  module.exports = {
    mongoURL: 'mongodb://localhost/vidjot-dev'
  }
}