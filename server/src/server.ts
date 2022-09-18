import express from "express"
import cors from 'cors'
import {PrismaClient} from '@prisma/client'
import { convertHourStringToMinutes } from "./utils/convertHourStringToMinutes"
import { convertMinutesToHourString } from "./utils/convertMinutesToHourString"

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({
  log: ['query']
})

app.get('/games', async (req,res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  })

  return res.status(200).json(games)
})

app.post('/games/:gameId/ads', async (req,res) => {
  const gameId = req.params.gameId
  const body = req.body
  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekdays: body.weekdays.join(','),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    }
  })
  return res.status(201).json(ad)
})

app.get('/games/:gameId/ads', async (req,res) => {
  const gameId = req.params.gameId

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekdays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {gameId},
    orderBy: {
      createdAt: 'desc',
    }
  })
  return res.status(200).json(ads.map(ad => {
    return {
      ...ad,
      weekdays: ad.weekdays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd)
    }
  }))
})

app.get('/ads/:adId/discord', async (req,res) => {
  const adId = req.params.adId

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {id: adId},
  })
  return res.status(200).json({discord: ad.discord})
})

app.listen(3333)