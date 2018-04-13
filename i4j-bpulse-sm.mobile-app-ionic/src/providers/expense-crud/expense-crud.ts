import { Injectable } from '@angular/core';
import { getRepository } from 'typeorm';
import { SharedMethodProvider } from '../shared-method/shared-method';
import { Expense } from '../../entities/Expense';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { CheckConectionProvider } from '../check-conection/check-conection';
import { RestApiProvider } from '../rest-api/rest-api';
import { SyncStatus } from '../../entities/SyncStatus';
import { DatabaseCreateProvider } from '../database-create/database-create';

@Injectable()
export class ExpenseCrudProvider {

  constructor(
    public sharedMethod: SharedMethodProvider,
    public checkConection: CheckConectionProvider,
    public restApi: RestApiProvider,
    public database: DatabaseCreateProvider
  ) {
  }

  /**
   * Funcion encargada de salvar los cambios de la entidad expense
   * 
   * @param data datos del formulario create-expense
   * @param is_new bool que indica si es un nuevo objeto o la modificacion de uno existente
   * @param old_expense object de tipo expense que trae el expense viejo a editar
   * @param itinerary object de tipo itinerary al que debera pertenecer el expense
   */
  async saveExpense(data: Array<any>, is_new: boolean, old_expense: any, itinerary: any) {
    const expense_repo = getRepository(Expense);
    let sync_repo = getRepository(SyncStatus);
    let now = moment().utc().unix() * 1000;;
    let user = await this.sharedMethod.getUser();
    let exist_conection: boolean = this.checkConection.isConected();
    let ok: boolean;

    if (is_new) {
      let expense = new Expense();
      let sync_status_ = await sync_repo.findOne({ id: 1 });

      expense.id = "27347958-d9c7-404b-93c9-468a0574253a"/* uuid() */;
      expense.atteched = "";
      expense.description = data['expenseDescription'];
      expense.value = data['expenseValue'];
      expense.item = data['expenseItem'];
      expense.itinerary = itinerary;
      expense.user = user.user_obj;
      expense.user_created = user.user_obj.id;
      expense.user_updated = user.user_obj.id;
      expense.date_created = now;
      expense.date_updated = now;
      expense.sync_status = sync_status_;

      //if (data['atteched_img'].length > 2) {
        this.restApi.modifyHeaders("Content-Type", "delete");
      //await this.database.moveImageToFolderEntity(data['atteched_img'], expense.id, "expense");
      expense.atteched = await this.database.saveImageInDevice("local;image/jpg;" + data['atteched_img'], "expense", expense.id);
      //}

      if (exist_conection) {
        try {
          ok = await this.restApi.sendDataToServer('expense', expense, 'create');
          if (ok)
            await expense_repo.save(expense);
        } catch (error) {
          await expense_repo.save(expense);
        }
      }
      else {
        await expense_repo.save(expense);
      }
    }
    else {
      let sync_status_ = await sync_repo.findOne({ id: 2 });
      old_expense.atteched = "";
      old_expense.description = data['expenseDescription'];
      old_expense.value = data['expenseValue'];
      old_expense.item = data['expenseItem'];
      old_expense.user_updated = user.user_obj.id;
      old_expense.date_updated = now;
      old_expense.sync_status = sync_status_;

      if (data['atteched_img'].length > 2) {
        this.restApi.modifyHeaders("Content-Type", "delete");
        await this.database.moveImageToFolderEntity(data['atteched_img'], old_expense.id, "expense");
        old_expense.atteched = await this.database.saveImageInDevice("local;image/jpg;" + data['atteched_img'], "expense", old_expense.id);
      }

      if (exist_conection) {
        try {
          ok = await this.restApi.sendDataToServer('expense', old_expense, 'create');
          if (ok)
            await expense_repo.save(old_expense);
        } catch (error) {
          await expense_repo.save(old_expense);
        }
      }
      else {
        await expense_repo.save(old_expense);
      }
    }
  }

  /**
   * Funcion encargada de listar a partir de un id de expense las demas asociadas a ese itinerario
   * @param expense Expense object 
   */
  async getListExpensesAsync(expense: any) {
    let expense_repo = getRepository(Expense);
    this.restApi.modifyHeaders();
    await this.restApi.getMasterListFromServer('expense');

    if (expense) {
      let list_expense = await expense_repo.createQueryBuilder('e')
        .leftJoinAndSelect('e.itinerary', 'itinerary')
        .leftJoinAndSelect('e.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .andWhere("e.id = :id", { id: expense.id })
        .getMany();

      return list_expense;
    }
    else
      return [];
  }
}
