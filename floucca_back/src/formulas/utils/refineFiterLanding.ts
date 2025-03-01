// import {GeneralFilterDto} from "../../shared/dto/GeneralFilter.dto";
// import {GetFilteredInterface} from "../../backend/landings/interface/getFiltered.interface";
// import {PrismaService} from "../../prisma/prisma.service";
//
// export async function refineFilter(filter: GeneralFilterDto, prisma: PrismaService): Promise<GetFilteredInterface> {
//     let {
//         region
//         , coop
//         , port_id
//     } = filter
//
//     let ports = []
//
//     if (filter.region && filter.region.length > 0) {
//         ports = await prisma.ports.findMany({
//             where: {
//                 coop: {
//                     region: {
//                         region_code: region ? {in: region} : undefined
//                     }
//                 }
//             },
//             select: {
//                 port_id: true
//             }
//         })
//     } else if (filter.coop || filter.coop.length > 0) {
//         ports = await prisma.ports.findMany({
//             where: {
//                 coop_code: coop ? {in: coop} : undefined
//             },
//             select: {
//                 port_id: true
//             }
//         })
//     }
//
//     port_id = ports.map(port => port.port_id)
//
//     return port_id;
//
//
// }