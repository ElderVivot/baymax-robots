import 'dotenv/config'
import SaveXMLsGoiania from './jobs/SaveXMLsGoiania'
import Queue from './lib/Queue'

Queue.process(SaveXMLsGoiania.handle)