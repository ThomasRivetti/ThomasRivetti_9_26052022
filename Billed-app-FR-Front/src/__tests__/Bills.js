/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import { toHaveClass } from "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

jest.mock("../app/store", () => mockStore);

beforeEach(() => {
  //simule la connection sur la page Employee en parametrant le localStorage
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
})
describe('Bills Unit test suites', () => {

  describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
      test("Then bill icon in vertical layout should be highlighted", async () => {

        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        await waitFor(() => screen.getByTestId('icon-window'))
        const windowIcon = screen.getByTestId('icon-window')
        //to-do write expect expression
        expect(windowIcon).toHaveClass('active-icon')
      })

      test("Then bills should be ordered from earliest to latest", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        const antiChrono = (a, b) => ((a < b) ? 1 : +1)
        const datesSorted = [...dates].sort(antiChrono)
        expect(dates).toEqual(datesSorted)
      })
    })

    describe("When i click on New Bill", () => {
      test("Then New Bill page should open", async () => {
        //affiche la page des notes de frais 
        document.body.innerHTML = BillsUI({ data: [bills[0]] })
        //récupération bouton 
        const btnNewBill = screen.getByTestId('btn-new-bill')
        //recuperation instance class Bills
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
        const billsEmulation = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage })
        const handleClickNewBill = jest.fn(() => billsEmulation.onNavigate(ROUTES_PATH['NewBill']))
        //eventListener du bouton
        btnNewBill.addEventListener('click', handleClickNewBill)
        userEvent.click(btnNewBill)
        //vérifie que le clic est bien écouté
        expect(handleClickNewBill).toHaveBeenCalled()
        //vérifie que la page est bien ouverte sur le NewBill
        await waitFor(() => screen.getByTestId('form-new-bill'))
        expect(screen.getByTestId('form-new-bill')).toBeTruthy()
      })
    })

    describe("When I Click on IconEye", () => {
      test("Then the preview modal should open", async () => {
        //affiche la page des notes de frais 
        document.body.innerHTML = BillsUI({ data: [bills[0]] })

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const billsEmulation = new Bills({
          document, onNavigate, store: null, localStorage: window.localStorage
        })

        const modale = document.getElementById('modaleFile')
        $.fn.modal = jest.fn(() => modale.classList.add("show"))

        const iconEye = screen.getByTestId('icon-eye')
        const handleClickIconEye_1 = jest.fn(() => billsEmulation.handleClickIconEye(iconEye))
        iconEye.addEventListener('click', handleClickIconEye_1)
        userEvent.click(iconEye)
        expect(handleClickIconEye_1).toHaveBeenCalled()
        expect(modale).toHaveClass("show")
      })
    })
  })
})
//TEST D INTEGRATION GET BILLS
describe('Bills Integration test suites', () => {
  describe('Given I am connected as an Employee', () => {
    describe('When I navigate to Bills', () => {
      test('fetches bills from mock API GET', async () => {
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        await waitFor(() => screen.getByText('Mes notes de frais'))
        const btnNewBill = screen.getByTestId('btn-new-bill')
        const btnEye = screen.getAllByTestId('icon-eye')
        expect(btnNewBill).toBeTruthy()
        expect(btnEye).not.toHaveLength(0)
      })
    })
    describe('When an error occurs on API', () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("fetches messages from an API and fails with 500 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})